defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetro.ChannelCase, async: true
  alias RemoteRetro.RetroChannel
  alias RemoteRetro.Repo
  alias RemoteRetro.Idea

  describe "joining a RetroChannel" do
    test "assigns the retro_id to the socket", %{ retro: retro } do
      { :ok, _, socket } =
        socket("", %{ user: "wyatt derp" })
        |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

      assert socket.assigns.retro_id == retro.id
    end

    test "results in the push of a presence state to the new user", %{ retro: retro } do
      { :ok, _, _socket } =
        socket("", %{ user: "wyatt derp" })
        |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

      assert_push "presence_state", %{ "wyatt derp" => %{} }
    end

    test "results in the broadcast of a new presence diff to all connected clients", %{ retro: retro } do
      { :ok, _, _socket } =
        socket("", %{ user: "wyatt derp" })
        |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

      assert_broadcast "presence_diff", %{ joins: %{ "wyatt derp" => %{} } }
    end

    test "results in a push of existing ideas to the new user", %{ retro: retro } do
      { :ok, _, _socket } =
        socket("", %{ user: "wyatt derp" })
        |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

      assert_push "existing_ideas", %{ ideas: [] }
    end

    test "results in the assignment of all of that retro's existing ideas to the socket", %{ retro: retro } do
      Repo.insert!(%Idea{ category: "sad", body: "errbody lovin", retro_id: retro.id })

      { :ok, _, socket } =
        socket("", %{ user: "wyatt derp" })
        |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

      assert length(socket.assigns.ideas) == 1

      sole_existing_idea = List.first(socket.assigns.ideas)
      %{ body: body, category: category, retro_id: retro_id } = sole_existing_idea

      assert body == "errbody lovin"
      assert category == "sad"
      assert retro_id == retro.id
    end
  end

  test "the inclusion of a user map with metadata about a user's presence in the retro", %{ retro: retro } do
    { :ok, _, _socket } =
      socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

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
    test "results in the broadcast of the new idea to all connected clients", %{ retro: retro } do
      { :ok, _, socket } =
        socket("", %{ user: "wyatt derp" })
        |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

      push(socket, "new_idea", %{ category: "happy", body: "we're pacing well" })

      assert_broadcast("new_idea_received", %{ category: "happy", body: "we're pacing well" })
    end
  end
end
