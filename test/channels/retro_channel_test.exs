defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetro.ChannelCase, async: true
  alias RemoteRetro.RetroChannel
  alias RemoteRetro.Repo
  alias RemoteRetro.Idea
  alias RemoteRetro.Presence

  @mock_user Application.get_env(:remote_retro, :mock_user)

  defp join_the_retro_channel(context) do
    retro = context[:retro]
    { :ok, _, socket } =
      socket("", %{ token: Phoenix.Token.sign(socket, "user", @mock_user) })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    Map.put(context, :socket, socket)
  end

  defp persist_idea_for_retro(context) do
    %{idea_category: category, idea_body: body, retro: retro} = context

    changeset = %Idea{category: category, body: body, retro_id: retro.id}
    Repo.insert!(changeset)
    context
  end

  describe "joining a RetroChannel" do
    setup [:join_the_retro_channel]

    test "assigns the retro_id to the socket", %{ socket: socket, retro: retro } do
      assert socket.assigns.retro_id == retro.id
    end

    test "results in the push of a presence state to the new user" do
      assert_push "presence_state", %{}
    end

    test "results in a push of existing ideas to the new user" do
      assert_push "existing_ideas", %{ ideas: [] }
    end

    test "results in a Presence tracking of the new user", %{retro: retro} do
      result = Presence.list("retro:" <> retro.id)

      presence_object =
        Map.values(result)
        |> List.first
        |> Map.get(:metas)
        |> List.first

      assert presence_object["email"] == @mock_user["email"]
      assert presence_object["given_name"] == @mock_user["given_name"]
      assert presence_object["family_name"] == @mock_user["family_name"]
    end
  end

  describe "joining a retro that already has a persisted idea" do
    setup [:persist_idea_for_retro, :join_the_retro_channel]

    @tag idea_category: "sad", idea_body: "WIP commits on master"
    test "results in the assignment of all of those ideas to the socket", %{socket: socket} do
      assert length(socket.assigns.ideas) == 1

      sole_existing_idea = List.first(socket.assigns.ideas)

      assert %{ body: "WIP commits on master", category: "sad", retro_id: _, id: _ } = sole_existing_idea
    end
  end

  describe "pushing a new idea to the socket" do
    setup [:join_the_retro_channel]
    test "results in the broadcast of the new idea to all connected clients", %{ socket: socket } do
      push(socket, "new_idea", %{ category: "happy", body: "we're pacing well" })

      assert_broadcast("new_idea_received", %{ category: "happy", body: "we're pacing well", id: _ })
    end
  end

  describe "the emission of a `presence_diff` event" do
    setup [:join_the_retro_channel]

    test "does not make its way to the client", %{socket: socket} do
      broadcast_from socket, "presence_diff", %{}
      refute_push "presence_diff", %{}
    end

    test "results in the push of a `presence_state` event", %{socket: socket} do
      broadcast_from socket, "presence_diff", %{}
      assert_push "presence_state", %{}
    end
  end
end
