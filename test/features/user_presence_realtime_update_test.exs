defmodule UserPresenceRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  test "the realtime updates of other users entering/leaving a retro",
       ~M{retro, session: session_one, non_facilitator} do
    session_one = visit_retro(session_one, retro)

    assert_has(session_one, Query.css("#user-list li", count: 1))

    session_two = new_authenticated_browser_session(non_facilitator)
    visit_retro(session_two, retro)

    assert_has(session_one, Query.css("#user-list li", count: 2))

    Wallaby.end_session(session_two)

    assert_has(session_one, Query.css("#user-list li", count: 1))
  end
end
