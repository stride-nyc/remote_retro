defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetro.ChannelCase, async: true
  alias RemoteRetro.RetroChannel
  alias RemoteRetro.Repo
  alias RemoteRetro.Idea

  setup [:join_the_retro_channel]

  describe "joining a RetroChannel" do
    test "assigns the retro_id to the socket", %{ socket: socket, retro: retro } do
      assert socket.assigns.retro_id == retro.id
    end

    test "results in the push of a presence state to the new user" do
      assert_push "presence_state", %{ "wyatt derp" => %{} }
    end

    test "results in the broadcast of a new presence diff to all connected clients" do
      assert_broadcast "presence_diff", %{ joins: %{ "wyatt derp" => %{} } }
    end

    test "results in a push of existing ideas to the new user" do
      assert_push "existing_ideas", %{ ideas: [] }
    end
  end

  describe "joining a retro that already has a persisted idea" do
    setup [:persist_idea_for_retro, :join_the_retro_channel]

    test "results in the assignment of all of those ideas to the socket", %{ retro: retro, socket: socket } do
      assert length(socket.assigns.ideas) == 1

      sole_existing_idea = List.first(socket.assigns.ideas)
      %{ body: body, category: category, retro_id: retro_id } = sole_existing_idea

      assert body == "errbody lovin"
      assert category == "sad"
      assert retro_id == retro.id
    end
  end

  test "the inclusion of a user map with metadata about a user's presence in the retro" do
    assert_push "presence_state", %{
      "wyatt derp" => %{
        user: %{ name: _, online_at: _online_at }
      }
    }

    assert_push "presence_diff", %{
      joins: %{
        "wyatt derp" => %{
          user: %{ name: _, online_at: _online_at }
        }
      }
    }
  end

  describe "pushing a new idea to the socket" do
    test "results in the broadcast of the new idea to all connected clients", %{ socket: socket } do
      push(socket, "new_idea", %{ category: "happy", body: "we're pacing well" })

      assert_broadcast("new_idea_received", %{ category: "happy", body: "we're pacing well" })
    end
  end

  defp join_the_retro_channel(context) do
    retro = context[:retro]
    { :ok, _, socket } =
      socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    context = Map.put(context, :socket, socket)
  end

  defp persist_idea_for_retro(context) do
    Repo.insert!(%Idea{ category: "sad", body: "errbody lovin", retro_id: context[:retro].id })
    context
  end
end
