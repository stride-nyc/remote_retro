defmodule RemoteRetro.RetroChannelTest do
  use RemoteRetro.ChannelCase, async: true
  alias RemoteRetro.RetroChannel

  test "the assignment of the retro_id to the socket", %{ retro: retro } do
    { :ok, _, socket } = socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    assert socket.assigns.retro_id == retro.id
  end

  test "the push of a new presence state when a user joins the retro", %{ retro: retro } do
    { :ok, _, _socket } = socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    assert_push "presence_state", %{ "wyatt derp" => %{} }
  end

  test "the push of a new presence diff when a user joins the retro", %{ retro: retro } do
    { :ok, _, _socket } = socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    assert_push "presence_diff", %{ joins: %{ "wyatt derp" => %{} } }
  end

  test "the inclusion of a user map with metadata about their joining the retro", %{ retro: retro } do
    { :ok, _, _socket } = socket("", %{ user: "wyatt derp" })
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

  test "the broadcasting of new ideas to clients when pushed to the socket", %{ retro: retro } do
    { :ok, _, socket } = socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RetroChannel, "retro:" <> retro.id)

    push(socket, "new_idea", %{ category: "happy", body: "we're pacing well" })

    assert_broadcast("new_idea_received", %{ category: "happy", body: "we're pacing well" })
  end
end
