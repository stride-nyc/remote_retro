defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetro.ChannelCase, async: false
  use Bamboo.Test, shared: true

  alias RemoteRetro.{RetroChannel, Repo, Idea, Presence, Retro, Vote, User}

  @test_user_one Application.get_env(:remote_retro, :test_user_one)

  defp join_the_retro_channel(%{retro: retro} = context) do
    {:ok, user} = User.upsert_record_from(oauth_info: @test_user_one)

    {:ok, join_response, socket} =
      socket("", %{user_token: Phoenix.Token.sign(socket(), "user", user)})
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    Map.merge(context, %{socket: socket, join_response: join_response, user: user})
  end

  describe "joining a RetroChannel" do
    setup [:join_the_retro_channel]

    test "results in a response containing retro state", %{join_response: join_response} do
      assert join_response.votes
      assert join_response.ideas
      assert join_response.stage
      assert join_response.users
    end

    test "assigns the retro_id to the socket", %{socket: socket, retro: retro} do
      assert socket.assigns.retro_id == retro.id
    end

    test "results in the push of a presence state to the new user" do
      assert_push "presence_state", %{}
    end

    test "results in the push of a presence diff to the new user" do
      assert_push "presence_diff", %{}
    end

    test "results in a Presence tracking of the new user, including timestamp", %{retro: retro, user: user} do
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
    setup [:persist_users_for_retro, :join_the_retro_channel]

    @tag users: [@test_user_one]
    test "when in idea_generation stage results in the broadcast of the new idea to all connected clients", %{socket: socket, test_user: user} do
      user_id = user.id
      assignee_id = nil
      push(socket, "new_idea", %{category: "happy", body: "we're pacing well", userId: user_id, assigneeId: assignee_id})

      assert_broadcast("new_idea_received", %{category: "happy", body: "we're pacing well", id: _, user_id: ^user_id})
    end

    @tag users: [@test_user_one]
    test "when in action_items stage results in the broadcast of the new action item to all connected clients", %{socket: socket, test_user: user} do
      user_id = user.id
      push(socket, "new_idea", %{category: "action-item", body: "Do something about the pacing", userId: user_id, assigneeId: user_id})

      assert_broadcast("new_idea_received", %{category: "action-item", body: "Do something about the pacing", id: _, user_id: ^user_id, assignee_id: ^user_id})
    end
  end

  describe "pushing an `enable_edit_state` event to the socket" do
    setup [:join_the_retro_channel]
    test "broadcasts the same event with the given payload and editorToken", %{socket: socket} do
      push(socket, "enable_edit_state", %{"idea" => %{id: 4}, "editorToken" => "jkl"})

      assert_broadcast("enable_edit_state", %{"id" => 4, "editorToken" => "jkl"})
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
    setup [:persist_users_for_retro, :persist_idea_for_retro, :join_the_retro_channel]

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    @tag users: [@test_user_one]
    test "results in the broadcast of the edited idea to all connected clients", %{socket: socket, idea: idea} do
      idea_id = idea.id
      push(socket, "idea_edited", %{id: idea_id, body: "hell's bells", category: "happy", assigneeId: nil})

      assert_broadcast("idea_edited", %{body: "hell's bells", category: "happy", id: ^idea_id})
    end

    @tag idea: %Idea{category: "sad", body: "doggone keeper"}
    @tag users: [@test_user_one]
    test "results in the idea being updated in the database", %{socket: socket, idea: idea} do
      idea_id = idea.id
      push(socket, "idea_edited", %{id: idea_id, body: "hell's bells", category: "confused", assigneeId: nil})

      :timer.sleep(50)
      idea = Repo.get!(Idea, idea_id)
      assert idea.body == "hell's bells"
      assert idea.category == "confused"
    end
  end

  describe "pushing a delete event to the socket" do
    setup [:persist_users_for_retro, :join_the_retro_channel, :persist_idea_for_retro]

    @tag idea: %Idea{category: "sad", body: "WIP commits on master"}
    @tag users: [@test_user_one]
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
    setup [:persist_users_for_retro, :persist_idea_for_retro, :join_the_retro_channel]

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    @tag users: [@test_user_one]
    test "results in the broadcast of the vote to connected clients", %{socket: socket, idea: idea, test_user: user} do
      idea_id = idea.id
      user_id = user.id
      push(socket, "submit_vote", %{ideaId: idea_id, userId: user_id})
      :timer.sleep(25)
      assert_broadcast("vote_submitted", %{"idea_id" => ^idea_id, "user_id" => ^user_id})
    end

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    @tag users: [@test_user_one]
    test "results in the persistence of the vote", %{socket: socket, idea: idea, test_user: user} do
      idea_id = idea.id
      assert_raise(Ecto.NoResultsError, fn -> Repo.get_by!(Vote, idea_id: idea_id, user_id: user.id) end)
      push(socket, "submit_vote", %{ideaId: idea_id, userId: user.id})
      :timer.sleep(25)
      assert Repo.get_by!(Vote, idea_id: idea_id, user_id: user.id)
    end
  end

  describe "when a user has already used their votes" do
    setup [:persist_users_for_retro, :persist_idea_for_retro, :use_all_votes, :join_the_retro_channel]

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    @tag users: [@test_user_one]
    test "pushing 'vote_submitted' does not broadcast a vote", %{socket: socket, idea: idea, test_user: user} do
      idea_id = idea.id
      user_id = user.id
      push(socket, "submit_vote", %{ideaId: idea_id, userId: user_id})

      refute_broadcast("vote_submitted", %{"idea_id" => ^idea_id, "user_id" => ^user_id})
    end

    @tag idea: %Idea{category: "sad", body: "JavaScript"}
    @tag users: [@test_user_one]
    test "pushing 'vote_submitted' does not persist the vote", %{socket: socket, idea: idea, test_user: user} do
      idea_id = idea.id
      vote_count_query = from(v in "votes", where: [idea_id: ^idea_id, user_id: ^user.id])

      vote_count = Repo.aggregate(vote_count_query, :count, :id)
      assert vote_count == 5

      push(socket, "submit_vote", %{ideaId: idea_id, userId: user.id})
      :timer.sleep(50)

      vote_count = Repo.aggregate(vote_count_query, :count, :id)
      assert vote_count == 5
    end
  end
end


