defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetro.ChannelCase, async: true
  alias RemoteRetro.RetroChannel
  alias RemoteRetro.Repo
  alias RemoteRetro.Idea

  test "the assignment of the retro_id to the socket", %{ retro: retro } do
    { :ok, _, socket } =
      socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    assert socket.assigns.retro_id == retro.id
  end

  test "the assignment of the retro's existing ideas to the socket", %{ retro: retro } do
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

  test "the push of a new presence state when a user joins the retro", %{ retro: retro } do
    { :ok, _, _socket } =
      socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    assert_push "presence_state", %{ "wyatt derp" => %{} }
  end

  test "the push of a new presence diff when a user joins the retro", %{ retro: retro } do
    { :ok, _, _socket } =
      socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    assert_push "presence_diff", %{ joins: %{ "wyatt derp" => %{} } }
  end

  test "the inclusion of a user map with metadata about their joining the retro", %{ retro: retro } do
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

  test "the push of all existing ideas when a user joins the retro", %{ retro: retro } do
    { :ok, _, _socket } =
      socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    assert_push "existing_ideas", %{ ideas: [] }
  end

  test "the broadcasting of new ideas to clients when pushed to the socket", %{ retro: retro } do
    { :ok, _, socket } =
      socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    push(socket, "new_idea", %{ category: "happy", body: "we're pacing well" })

    assert_broadcast("new_idea_received", %{ category: "happy", body: "we're pacing well" })
  end
end
