defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetroWeb.ChannelCase, async: false

  alias RemoteRetro.{Repo, Idea, Retro, Vote}
  alias RemoteRetroWeb.{RetroChannel, Presence, RetroManagement}

  import Mock
  import ShorterMaps

  defp join_the_retro_channel(~M{retro, facilitator} = context) do
    {:ok, join_response, socket} =
      socket("", %{user_token: Phoenix.Token.sign(socket(), "user", facilitator)})
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

    test "results in a Presence tracking of the new user, including timestamp", ~M{retro, facilitator} do
      result = Presence.list("retro:" <> retro.id)

      presence_object =
        Map.values(result)
        |> List.first
        |> Map.get(:metas)
        |> List.first

      assert presence_object.email == facilitator.email
      assert presence_object.given_name == facilitator.given_name
      assert presence_object.family_name == facilitator.family_name
      assert is_integer(presence_object.online_at)
    end
  end

  describe "pushing a `retro_edited` event with a valid, non-'closed' stage" do
    setup [:join_the_retro_channel]

    test "broadcasts the same event to connected clients, along with stage", ~M{socket} do
      ref = push(socket, "retro_edited", %{stage: "action-items"})
      assert_reply ref, :ok

      assert_broadcast("retro_edited", %{"stage" => "action-items"})
    end

    test "updates the retro stage to the value from the pushed event", ~M{socket, retro} do
      ref = push(socket, "retro_edited", %{stage: "action-items"})
      assert_reply ref, :ok

      persisted_stage = Repo.get(Retro, retro.id).stage
      assert persisted_stage == "action-items"
    end
  end

  describe "when broadcast of the update fails" do
    setup [:join_the_retro_channel]

    test "rolls back the update to the retro", ~M{socket, retro} do
      with_mock Phoenix.Channel, [broadcast!: fn(_, _, _) ->
        raise "hell"
      end] do
        retro_before = Repo.get!(Retro, retro.id)
        ref = push(socket, "retro_edited", %{stage: "action-items"})
        assert_reply ref, :error # extra assertion required to wait for async process to complete

        retro_after = Repo.get!(Retro, retro.id)

        assert retro_after.stage == retro_before.stage
      end
    end
  end

  describe "when the retro update blows up" do
    setup [:join_the_retro_channel]

    with_mock RetroManagement, [update!: fn(_, _) ->
      raise "hell"
    end] do
      test "an error reply is sent", ~M{socket} do
        ref = push(socket, "retro_edited", %{stage: "year of the depend adult undergarment"})
        assert_reply ref, :error
      end

      test "does not trigger an 'retro_edited' broadcast to all connected clients", ~M{socket} do
        ref = push(socket, "retro_edited", %{stage: "year of the depend adult undergarment"})
        assert_reply ref, :error

        refute_broadcast("retro_edited", %{}, 10)
      end
    end
  end

  describe "pushing a valid new idea to the channel" do
    setup [:join_the_retro_channel]

    test "inserts the idea into the database", ~M{socket, facilitator} do
      user_id = facilitator.id
      idea_count_before = Repo.aggregate(Idea, :count, :id)

      ref = push(socket, "idea_submitted", %{category: "happy", body: "we're pacing well", userId: user_id, assigneeId: nil})
      assert_reply ref, :ok # extra assertion required to wait for async process to complete before

      idea_count_after = Repo.aggregate(Idea, :count, :id)

      assert (idea_count_after - idea_count_before) == 1
    end

    test "results in the broadcast of the new idea to all connected clients", ~M{socket, facilitator} do
      user_id = facilitator.id
      assignee_id = nil

      ref = push(socket, "idea_submitted", %{category: "happy", body: "we're pacing well", userId: user_id, assigneeId: assignee_id})
      assert_reply ref, :ok

      assert_broadcast("idea_committed", %{category: "happy", body: "we're pacing well", id: _, user_id: ^user_id})
    end

    test "rolls back the idea insertion if broadcast!/3 fails", ~M{socket, facilitator} do
      with_mock Phoenix.Channel, [broadcast!: fn(_, _, _) ->
        raise "hell"
      end] do
        user_id = facilitator.id
        idea_count_before = Repo.aggregate(Idea, :count, :id)

        ref = push(socket, "idea_submitted", %{category: "happy", body: "we're pacing well", userId: user_id, assigneeId: nil})
        assert_reply ref, :error # extra assertion required to wait for async process to complete before

        idea_count_after = Repo.aggregate(Idea, :count, :id)

        assert (idea_count_after - idea_count_before) == 0
      end
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

      refute_broadcast("idea_committed", %{}, 10)
    end
  end

  describe "pushing an `idea_edit_state_enabled` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload", ~M{socket} do
      push(socket, "idea_edit_state_enabled", %{id: 4})

      assert_broadcast("idea_edit_state_enabled", %{"id" => 4})
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
      ref = push(socket, "idea_edited", %{id: idea_id, body: "hell's bells", category: "happy", assignee_id: nil})
      assert_reply ref, :ok

      assert_broadcast("idea_edited", %{body: "hell's bells", category: "happy", id: ^idea_id})
    end

    @tag idea: %Idea{category: "sad", body: "doggone keeper"}
    test "results in the idea being updated in the database", ~M{socket, idea} do
      idea_id = idea.id
      ref = push(socket, "idea_edited", %{id: idea_id, body: "hell's bells", category: "confused", assignee_id: nil})
      assert_reply ref, :ok # allow async handler to complete before checking db

      idea = Repo.get!(Idea, idea_id)
      assert %Idea{body: "hell's bells", category: "confused"} = idea
    end

    @tag idea: %Idea{category: "sad", body: "no UI feedback on failure"}
    test "a failed broadcast rolls back the update of the idea", ~M{socket, idea} do
      with_mock Phoenix.Channel, [broadcast!: fn(_, _, _) -> raise "hell" end] do
        idea_id = idea.id
        ref = push(socket, "idea_edited", %{id: idea_id, body: "hell's bells", category: "confused", assignee_id: nil})
        assert_reply ref, :error # ensure async process complete before checking db state

        assert %{body: "no UI feedback on failure", category: "sad"} = Repo.get!(Idea, idea_id)
      end
    end
  end

  describe "pushing a delete event to the socket" do
    setup [:join_the_retro_channel, :persist_idea_for_retro]

    @tag idea: %Idea{category: "sad", body: "WIP commits on master"}
    test "results in a broadcast of the id of the deleted idea to all clients", ~M{socket, idea} do
      idea_id = idea.id
      ref = push(socket, "idea_deleted", idea_id)
      assert_reply ref, :ok

      assert_broadcast("idea_deleted", %{id: ^idea_id})
    end

    @tag idea: %Idea{category: "sad", body: "no UI feedback on failure"}
    test "removes the idea from the database", ~M{socket, idea} do
      idea_id = idea.id
      ref = push(socket, "idea_deleted", idea_id)
      assert_reply ref, :ok # ensure async process complete before checking db state

      assert_raise(Ecto.NoResultsError, fn -> Repo.get!(Idea, idea_id) end)
    end

    @tag idea: %Idea{category: "sad", body: "no UI feedback on failure"}
    test "a failed broadcast rolls back the deletion of the idea", ~M{socket, idea} do
      with_mock Phoenix.Channel, [broadcast!: fn(_, _, _) ->
        raise "hell"
      end] do
        idea_id = idea.id
        ref = push(socket, "idea_deleted", idea_id)
        assert_reply ref, :error # ensure async process complete before checking db state

        assert Repo.get!(Idea, idea_id)
      end
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
    test "results in the persistence of the vote", ~M{socket, idea, facilitator} do
      idea_id = idea.id
      assert_raise(Ecto.NoResultsError, fn -> Repo.get_by!(Vote, idea_id: idea_id, user_id: facilitator.id) end)

      ref = push(socket, "vote_submitted", %{idea_id: idea_id, user_id: facilitator.id})
      assert_reply ref, :ok, %{user_id: _user_id, idea_id: idea_id, id: _} # allow async handler to complete before checking db

      assert Repo.get_by!(Vote, idea_id: idea_id, user_id: facilitator.id)
    end

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    test "results in the broadcast of the persisted vote to connected clients", ~M{socket, idea, facilitator} do
      idea_id = idea.id
      user_id = facilitator.id
      ref = push(socket, "vote_submitted", %{idea_id: idea_id, user_id: user_id})
      assert_reply ref, :ok

      assert_broadcast("vote_submitted", %{idea_id: ^idea_id, user_id: ^user_id, id: _})
    end

    @tag idea: %Idea{category: "sad", body: "panda"}
    test "rolls back the vote insertion if broadcast!/3 fails", ~M{socket, idea, facilitator} do
      with_mock Phoenix.Channel, [broadcast!: fn(_, _, _) ->
        raise "hell"
      end] do
        user_id = facilitator.id
        idea_id = idea.id
        vote_count_before = Repo.aggregate(Vote, :count, :id)

        ref = push(socket, "vote_submitted", %{idea_id: idea_id, user_id: user_id})
        assert_reply ref, :error # extra assertion required to wait for async process to complete before

        vote_count_after = Repo.aggregate(Vote, :count, :id)

        assert (vote_count_after - vote_count_before) == 0
      end
    end
  end

  describe "pushing a `vote_retracted` event with a given id" do
    setup [:persist_idea_for_retro, :persist_a_vote, :join_the_retro_channel]

    test "removes the vote with the given id from the database", ~M{socket, vote} do
      ref = push(socket, "vote_retracted", %{id: vote.id})
      assert_reply ref, :ok

      refute Repo.get(Vote, vote.id)
    end

    test "broadcasts the same event to connected clients, along with retracted vote", ~M{socket, vote} do
      vote_id = vote.id
      ref = push(socket, "vote_retracted", %{id: vote_id})
      assert_reply ref, :ok

      assert_broadcast("vote_retracted", %{"id" => ^vote_id})
    end

    test "broadcasts the same event to the initiator client", ~M{socket, vote} do
      vote_id = vote.id
      ref = push(socket, "vote_retracted", %{id: vote_id})
      assert_reply ref, :ok

      assert_push("vote_retracted", %{"id" => ^vote_id})
    end
  end

  describe "pushing an *invalid* vote to the channel" do
    setup [:join_the_retro_channel]

    test "results in an error reply", ~M{socket, facilitator} do
      invalid_vote =  %{idea_id: "HaaaaiYah!", user_id: facilitator.id}

      push(socket, "vote_submitted", invalid_vote)
      ref = push(socket, "vote_submitted", invalid_vote)

      assert_reply ref, :error
    end

    test "does not trigger an 'idea_committed' broadcast to all connected clients", ~M{socket, facilitator} do
      invalid_vote =  %{idea_id: "The Fart Store", user_id: facilitator.id}

      push(socket, "vote_submitted", invalid_vote)

      refute_broadcast("vote_submitted", %{}, 10)
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
