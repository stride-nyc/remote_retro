defmodule RemoteRetro.RoomChannelTest do
  use RemoteRetro.ChannelCase, async: true

  alias RemoteRetro.RoomChannel

  test "the push of a new presence state when a user joins the lobby" do
    { :ok, _, _socket } = socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RoomChannel, "room:lobby")

    assert_push "presence_state", %{ "wyatt derp" => %{} }
  end

  test "the push of a new presence diff when a user joins the lobby" do
    { :ok, _, _socket } = socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RoomChannel, "room:lobby")

    assert_push "presence_diff", %{ joins: %{ "wyatt derp" => %{} } }
  end

  test "the inclusion of a user map with metadata about their joining the room" do
    { :ok, _, _socket } = socket("", %{ user: "wyatt derp" })
      |> subscribe_and_join(RoomChannel, "room:lobby")

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
end
