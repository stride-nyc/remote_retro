defmodule StageProgressionRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  test "realtime stage progression for connected users", ~M{retro, session: facilitator_session} do
    participant_session = new_authenticated_browser_session()
    retro_path = "/retros/" <> retro.id
    facilitator_session = visit(facilitator_session, retro_path)
    participant_session = visit(participant_session, retro_path)

    submit_idea(facilitator_session, %{category: "happy", body: "it works"})

    assert participant_session |> find(Query.css(".ui.button", text: "Proceed to Action Items", count: 0))

    click_and_confirm(facilitator_session, "Proceed to Voting")

    assert participant_session |> find(Query.css(".ui.button", text: "Proceed to Action Items", count: 1))
  end
end
