defmodule StageProgressionRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  test "realtime stage progression for connected users", ~M{retro, session: facilitator_session, non_facilitator} do
    participant_session = new_authenticated_browser_session(non_facilitator)
    retro_path = "/retros/" <> retro.id
    facilitator_session = visit(facilitator_session, retro_path)
    participant_session = visit(participant_session, retro_path)

    submit_idea(facilitator_session, %{category: "happy", body: "it works"})

    assert_has(facilitator_session, Query.css(".ui.header", text: "Stage Change: Voting!", count: 0))

    click_and_confirm(facilitator_session, "Proceed to Voting")

    assert_has(facilitator_session, Query.css(".ui.header", text: "Stage Change: Voting!", count: 1))
    assert_has(participant_session, Query.css(".ui.header", text: "Stage Change: Voting!", count: 1))
  end
end
