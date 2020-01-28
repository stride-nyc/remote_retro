defmodule StageProgressionRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  @tag [
    retro_stage: "prime-directive",
  ]
  test "realtime stage progression for connected users", ~M{retro, session: facilitator_session, non_facilitator} do
    participant_session = new_authenticated_browser_session(non_facilitator)
    retro_path = "/retros/" <> retro.id
    facilitator_session = visit(facilitator_session, retro_path)
    participant_session = visit(participant_session, retro_path)

    click_and_confirm_progression_to(facilitator_session, "Idea Generation")

    assert_has(facilitator_session, Query.css(".ui.header", text: "Stage Change: Idea Generation!", count: 1))
    assert_has(participant_session, Query.css(".ui.header", text: "Stage Change: Idea Generation!", count: 1))
  end
end
