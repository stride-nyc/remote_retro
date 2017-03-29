defmodule UserPresenceRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  test "the realtime updates of other users entering/leaving a retro", %{session: session_one, retro: retro} do
    retro_path = "/retros/" <> retro.id
    session_one = visit(session_one, retro_path)

    assert session_one |> find(Query.css("#user-list li", count: 1))

    session_two = new_browser_session()
    authenticate(session_two) |> visit(retro_path)

    assert session_one |> find(Query.css("#user-list li", count: 2))

    Wallaby.end_session(session_two)

    assert session_one |> find(Query.css("#user-list li", count: 1))
  end
end
