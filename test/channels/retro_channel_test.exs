defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetro.ChannelCase, async: true
  alias RemoteRetro.RetroChannel
  alias RemoteRetro.Repo
  alias RemoteRetro.Idea

  defp join_the_retro_channel(context) do
    retro = context[:retro]
    { :ok, _, socket } =
      socket("", %{ user: "wyatt derp" })
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

    test "results in the broadcast of a new presence diff to all connected clients" do
      assert_broadcast "presence_diff", %{joins: %{}, leaves: %{}}
    end

    test "results in a push of existing ideas to the new user" do
      assert_push "existing_ideas", %{ ideas: [] }
    end
  end

  describe "joining a retro that already has a persisted idea" do
    setup [:persist_idea_for_retro, :join_the_retro_channel]

    @tag idea_category: "sad", idea_body: "WIP commits on master"
    test "results in the assignment of all of those ideas to the socket", %{socket: socket} do
      assert length(socket.assigns.ideas) == 1

      sole_existing_idea = List.first(socket.assigns.ideas)

      assert %{ body: "WIP commits on master", category: "sad", retro_id: _ } = sole_existing_idea
    end
  end

  describe "pushing a new idea to the socket" do
    setup [:join_the_retro_channel]
    test "results in the broadcast of the new idea to all connected clients", %{ socket: socket } do
      push(socket, "new_idea", %{ category: "happy", body: "we're pacing well" })

      assert_broadcast("new_idea_received", %{ category: "happy", body: "we're pacing well" })
    end
  end

end
