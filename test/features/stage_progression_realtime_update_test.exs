defmodule StageProgressionRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  @tag [
    retro_stage: "prime-directive"
  ]
  test "realtime stage progression for connected users", %{retro: retro, session: facilitator_session, non_facilitator: non_facilitator} do
    participant_session = new_authenticated_browser_session(non_facilitator)
    facilitator_session = visit_retro(facilitator_session, retro)
    participant_session = visit_retro(participant_session, retro)

    click_and_confirm_progression_to(facilitator_session, "Idea Generation")

    assert_has(facilitator_session, Query.css(".ui.header", text: "Stage Change: Idea Generation!", count: 1))
    assert_has(participant_session, Query.css(".ui.header", text: "Stage Change: Idea Generation!", count: 1))
  end
end
