defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetro.ChannelCase, async: false
  use Bamboo.Test, shared: true

  alias RemoteRetro.{RetroChannel, Repo, Idea, Presence, Retro, Vote}

  @mock_user Application.get_env(:remote_retro, :mock_user)

  defp join_the_retro_channel(%{retro: retro} = context) do
    {:ok, _, socket} =
      socket("", %{user_token: Phoenix.Token.sign(socket(), "user", @mock_user)})
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    Map.put(context, :socket, socket)
  end

  describe "joining a RetroChannel" do
    setup [:join_the_retro_channel]

    test "assigns the retro_id to the socket", %{socket: socket, retro: retro} do
      assert socket.assigns.retro_id == retro.id
    end

    test "results in the push of a presence state to the new user" do
      assert_push "presence_state", %{}
    end

    test "results in the push of a presence diff to the new user" do
      assert_push "presence_diff", %{}
    end

    test "results in a Presence tracking of the new user, including timestamp", %{retro: retro} do
      result = Presence.list("retro:" <> retro.id)

      presence_object =
        Map.values(result)
        |> List.first
        |> Map.get(:metas)
        |> List.first

      assert presence_object["email"] == @mock_user["email"]
      assert presence_object["given_name"] == @mock_user["given_name"]
      assert presence_object["family_name"] == @mock_user["family_name"]
      assert %{online_at: _} = presence_object
    end
  end

  describe "pushing `proceed_to_next_stage` with a stage of 'closed'" do
    setup [:join_the_retro_channel]

    test "broadcasts the same event to connected clients, along with stage", %{socket: socket} do
      push(socket, "proceed_to_next_stage", %{stage: "closed"})

      assert_broadcast("proceed_to_next_stage", %{"stage" => "closed"})
    end
  end

  describe "pushing a `proceed_to_next_stage` event" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event to connected clients, along with stage", %{socket: socket} do
      push(socket, "proceed_to_next_stage", %{stage: "action-items"})

      assert_broadcast("proceed_to_next_stage", %{"stage" => "action-items"})
    end

    test "updates the retro stage to the value from the pushed event", %{socket: socket, retro: retro} do
      push(socket, "proceed_to_next_stage", %{stage: "action-items"})

      assert_broadcast("proceed_to_next_stage", %{"stage" => "action-items"})
      persisted_stage = Repo.get(Retro, retro.id).stage
      assert persisted_stage == "action-items"
    end

    test "doesn't send an email containing the retro action items", %{socket: socket} do
      push(socket, "proceed_to_next_stage", %{stage: "action-items"})
      assert_no_emails_delivered()
    end
  end

  describe "pushing a new idea to the socket" do
    setup [:persist_user_for_retro, :join_the_retro_channel]

    @tag user: @mock_user
    test "results in the broadcast of the new idea to all connected clients", %{socket: socket, user: user} do
      user_id = user.id
      push(socket, "new_idea", %{category: "happy", body: "we're pacing well", userId: user_id})

      assert_broadcast("new_idea_received", %{category: "happy", body: "we're pacing well", id: _, user_id: ^user_id})
    end
  end

  describe "pushing an `enable_edit_state` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload", %{socket: socket} do
      push(socket, "enable_edit_state", %{id: 4})

      assert_broadcast("enable_edit_state", %{"id" => 4})
    end
  end

  describe "pushing an `disable_edit_state` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload", %{socket: socket} do
      push(socket, "disable_edit_state", %{id: 4})

      assert_broadcast("disable_edit_state", %{"id" => 4})
    end
  end

  describe "pushing a `user_typing_idea` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload", %{socket: socket} do
      push(socket, "user_typing_idea", %{userToken: "insaneToken"})

      assert_broadcast("user_typing_idea", %{"userToken" => "insaneToken"})
    end
  end

  describe "pushing an `idea_live_edit` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload", %{socket: socket} do
      push(socket, "idea_live_edit", %{id: 4, liveEditText: "updated"})

      assert_broadcast("idea_live_edit", %{"id" => 4, "liveEditText" => "updated"})
    end
  end

  describe "pushing an edit of an idea to the socket" do
    setup [:persist_user_for_retro, :persist_idea_for_retro, :join_the_retro_channel]

    @tag user: @mock_user
    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    test "results in the broadcast of the edited idea to all connected clients", %{socket: socket, idea: idea} do
      idea_id = idea.id
      push(socket, "idea_edited", %{id: idea_id, body: "hell's bells"})

      assert_broadcast("idea_edited", %{body: "hell's bells", id: ^idea_id})
    end


    @tag user: @mock_user
    @tag idea: %Idea{category: "sad", body: "doggone keeper"}
    test "results in the idea being updated in the database", %{socket: socket, idea: idea} do
      idea_id = idea.id
      push(socket, "idea_edited", %{id: idea_id, body: "hell's bells"})

      :timer.sleep(50)
      idea = Repo.get!(Idea, idea_id)
      assert idea.body == "hell's bells"
    end
  end

  describe "pushing a delete event to the socket" do
    setup [:persist_user_for_retro, :join_the_retro_channel, :persist_idea_for_retro]

    @tag user: @mock_user
    @tag idea: %Idea{category: "sad", body: "WIP commits on master"}
    test "results in a broadcast of the id of the deleted idea to all clients", %{socket: socket, idea: idea} do
      idea_id = idea.id
      push(socket, "delete_idea", idea_id)

      assert_broadcast("idea_deleted", %{id: ^idea_id})
    end
  end

  describe "pushing a `highlight_idea` event to the socket" do
    setup [:join_the_retro_channel]

    test "broadcasts the id with the highlighted state", %{socket: socket} do
      push(socket, "highlight_idea", %{"id" => 1, "isHighlighted" => false})

      assert_broadcast("idea_highlighted", %{"id" => 1, "isHighlighted" => false})
    end
  end

  describe "pushing a `submit_vote` event to the socket" do
    setup [:persist_user_for_retro, :persist_idea_for_retro, :persist_participation_for_retro, :join_the_retro_channel]

    @tag user: @mock_user
    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    @tag vote_count: 0
    test "results in the broadcast of the vote to connected clients", %{socket: socket, idea: idea, user: user} do
      idea_id = idea.id
      user_id = user.id
      push(socket, "submit_vote", %{ideaId: idea_id, userId: user.id})

      assert_broadcast("vote_submitted", %{"idea_id" => ^idea_id, "user_id" => ^user_id})
    end

    @tag user: @mock_user
    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    @tag vote_count: 0
    test "results in the persistence of the vote", %{socket: socket, idea: idea, user: user} do
      idea_id = idea.id
      push(socket, "submit_vote", %{ideaId: idea_id, userId: user.id})
      :timer.sleep(50)
      assert Repo.get_by!(Vote, idea_id: idea_id, user_id: user.id)
    end
  end
end


