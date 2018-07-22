defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetroWeb.ChannelCase, async: false
  use Bamboo.Test, shared: true

  alias RemoteRetro.{Repo, Idea, Retro, Vote}
  alias RemoteRetroWeb.{RetroChannel, Presence}

  import ShorterMaps

  defp join_the_retro_channel(~M{retro, user} = context) do
    {:ok, join_response, socket} =
      socket("", %{user_token: Phoenix.Token.sign(socket(), "user", user)})
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    Map.merge(context, ~M{socket, join_response})
  end

  describe "joining a RetroChannel" do
    setup [:join_the_retro_channel]

    test "results in a response containing retro state", ~M{join_response} do
      assert %{votes: _, ideas: _, stage: _, users: _} = join_response
    end

    test "assigns the retro_id to the socket", ~M{socket, retro} do
      assert socket.assigns.retro_id == retro.id
    end

    test "results in the push of a presence state to the new user" do
      assert_push "presence_state", %{}
    end

    test "results in the push of a presence diff to the new user" do
      assert_push "presence_diff", %{}
    end

    test "results in a Presence tracking of the new user, including timestamp", ~M{retro, user} do
      result = Presence.list("retro:" <> retro.id)

      presence_object =
        Map.values(result)
        |> List.first
        |> Map.get(:metas)
        |> List.first

      assert presence_object.email == user.email
      assert presence_object.given_name == user.given_name
      assert presence_object.family_name == user.family_name
      assert is_integer(presence_object.online_at)
    end
  end

  describe "pushing `retro_edited` with a stage of 'closed'" do
    setup [:join_the_retro_channel]

    test "broadcasts the same event to connected clients, along with stage", ~M{socket} do
      push(socket, "retro_edited", %{stage: "closed"})

      assert_broadcast("retro_edited", %{"stage" => "closed"})
    end
  end

  describe "pushing a `retro_edited` event" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event to connected clients, along with stage", ~M{socket} do
      push(socket, "retro_edited", %{stage: "action-items"})

      assert_broadcast("retro_edited", %{"stage" => "action-items"})
    end

    test "updates the retro stage to the value from the pushed event", ~M{socket, retro} do
      push(socket, "retro_edited", %{stage: "action-items"})

      assert_broadcast("retro_edited", %{"stage" => "action-items"})
      persisted_stage = Repo.get(Retro, retro.id).stage
      assert persisted_stage == "action-items"
    end

    test "doesn't send an email containing the retro action items", ~M{socket} do
      push(socket, "retro_edited", %{stage: "action-items"})
      assert_no_emails_delivered()
    end
  end

  describe "pushing a valid new idea to the channel" do
    setup [:join_the_retro_channel]

    test "inserts the idea into the database", ~M{socket, user} do
      user_id = user.id
      idea_count_before = Repo.aggregate(Idea, :count, :id)

      ref = push(socket, "idea_submitted", %{category: "happy", body: "we're pacing well", userId: user_id, assigneeId: nil})
      assert_reply ref, :ok # extra assertion required to wait for async process to complete before

      idea_count_after = Repo.aggregate(Idea, :count, :id)

      assert (idea_count_after - idea_count_before) == 1
    end

    test "results in the broadcast of the new idea to all connected clients", ~M{socket, user} do
      user_id = user.id
      assignee_id = nil

      push(socket, "idea_submitted", %{category: "happy", body: "we're pacing well", userId: user_id, assigneeId: assignee_id})

      assert_broadcast("idea_committed", %{category: "happy", body: "we're pacing well", id: _, user_id: ^user_id})
    end
  end

  describe "pushing an invalid idea to the channel" do
    setup [:join_the_retro_channel]

    test "results in an error reply", ~M{socket} do
      invalid_idea = %{category: "", body: "", userId: 666, assigneeId: nil}
      ref = push(socket, "idea_submitted", invalid_idea)
      assert_reply ref, :error
    end

    test "does not trigger an 'idea_committed' broadcast to all connected clients", ~M{socket} do
      invalid_idea = %{category: "", body: "", userId: 666, assigneeId: nil}

      push(socket, "idea_submitted", invalid_idea)

      refute_broadcast("idea_committed", %{}, 20)
    end
  end

  describe "pushing an `idea_edit_state_enabled` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload and editorToken", ~M{socket} do
      push(socket, "idea_edit_state_enabled", %{id: 4, editorToken: "jkl"})

      assert_broadcast("idea_edit_state_enabled", %{"id" => 4, "editorToken" => "jkl"})
    end
  end

  describe "pushing an `idea_edit_state_disabled` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload", ~M{socket} do
      push(socket, "idea_edit_state_disabled", %{id: 4})

      assert_broadcast("idea_edit_state_disabled", %{"id" => 4})
    end
  end

  describe "pushing a `idea_typing_event` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload", ~M{socket} do
      push(socket, "idea_typing_event", %{userToken: "insaneToken"})

      assert_broadcast("idea_typing_event", %{"userToken" => "insaneToken"})
    end
  end

  describe "pushing an `idea_live_edit` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload", ~M{socket} do
      push(socket, "idea_live_edit", %{id: 4, liveEditText: "updated"})

      assert_broadcast("idea_live_edit", %{"id" => 4, "liveEditText" => "updated"})
    end
  end

  describe "pushing an edit of an idea to the socket" do
    setup [:persist_idea_for_retro, :join_the_retro_channel]

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    test "results in the broadcast of the edited idea to all connected clients", ~M{socket, idea} do
      idea_id = idea.id
      push(socket, "idea_edited", %{id: idea_id, body: "hell's bells", category: "happy", assigneeId: nil})

      assert_broadcast("idea_edited", %{body: "hell's bells", category: "happy", id: ^idea_id})
    end

    @tag idea: %Idea{category: "sad", body: "doggone keeper"}
    test "results in the idea being updated in the database", ~M{socket, idea} do
      idea_id = idea.id
      push(socket, "idea_edited", %{id: idea_id, body: "hell's bells", category: "confused", assigneeId: nil})

      :timer.sleep(50)
      idea = Repo.get!(Idea, idea_id)
      assert idea.body == "hell's bells"
      assert idea.category == "confused"
    end
  end

  describe "pushing a delete event to the socket" do
    setup [:join_the_retro_channel, :persist_idea_for_retro]

    @tag idea: %Idea{category: "sad", body: "WIP commits on master"}
    test "results in a broadcast of the id of the deleted idea to all clients", ~M{socket, idea} do
      idea_id = idea.id
      push(socket, "idea_deleted", idea_id)

      assert_broadcast("idea_deleted", %{id: ^idea_id})
    end
  end

  describe "pushing a `idea_highlight_toggled` event to the socket" do
    setup [:join_the_retro_channel]

    test "broadcasts the id with the highlighted state", ~M{socket} do
      push(socket, "idea_highlight_toggled", %{"id" => 1, "isHighlighted" => false})

      assert_broadcast("idea_highlight_toggled", %{"id" => 1, "isHighlighted" => false})
    end
  end

  describe "pushing a `vote_submitted` event with a *valid* idea_id and user_id" do
    setup [:persist_idea_for_retro, :join_the_retro_channel]

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    test "results in the broadcast of the vote to connected clients", ~M{socket, idea, user} do
      idea_id = idea.id
      user_id = user.id
      ref = push(socket, "vote_submitted", %{idea_id: idea_id, user_id: user_id})
      assert_reply ref, :ok

      assert_broadcast("vote_submitted", %{"idea_id" => ^idea_id, "user_id" => ^user_id})
    end

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    test "results in the persistence of the vote", ~M{socket, idea, user} do
      idea_id = idea.id
      assert_raise(Ecto.NoResultsError, fn -> Repo.get_by!(Vote, idea_id: idea_id, user_id: user.id) end)
      push(socket, "vote_submitted", %{idea_id: idea_id, user_id: user.id})
      :timer.sleep(25)
      assert Repo.get_by!(Vote, idea_id: idea_id, user_id: user.id)
    end
  end

  describe "pushing an *invalid* vote to the channel" do
    setup [:join_the_retro_channel]

    test "results in an error reply", ~M{socket, user} do
      invalid_vote =  %{idea_id: "HaaaaiYah!", user_id: user.id}

      push(socket, "vote_submitted", invalid_vote)
      ref = push(socket, "vote_submitted", invalid_vote)

      assert_reply ref, :error
    end

    test "does not trigger an 'idea_committed' broadcast to all connected clients", ~M{socket, user} do
      invalid_vote =  %{idea_id: "The Fart Store", user_id: user.id}

      push(socket, "vote_submitted", invalid_vote)

      refute_broadcast("vote_submitted", %{}, 20)
    end
  end

  describe "pushing an unhandled message to the socket" do
    setup [:join_the_retro_channel]

    test "replies with an error tuple", ~M{socket} do
      ref = push socket, "preposterous_mess@ge_", %{some: "string"}
      assert_reply ref, :error, %{
        unhandled_message: %{
          type: "preposterous_mess@ge_",
          payload: %{"some" => "string"}
        },
      }
    end
  end
end
