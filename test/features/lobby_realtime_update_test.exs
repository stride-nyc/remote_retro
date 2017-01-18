defmodule LobbyRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: true

  @tag :skip
  test "the realtime updates of other users entering/leaving the room", %{session: session} do
    body_text = session
      |> visit("/")
      |> find("body")
      |> text

    assert body_text == "The React Playground"
  end
end
