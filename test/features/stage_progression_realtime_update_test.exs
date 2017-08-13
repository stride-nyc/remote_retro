defmodule StageProgressionRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  test "realtime stage progression for connected users", %{session: facilitator_session, retro: retro} do
    participant_session = new_browser_session()
    retro_path = "/retros/" <> retro.id
    facilitator_session = authenticate(facilitator_session) |> visit(retro_path)
    participant_session = authenticate(participant_session) |> visit(retro_path)
    stub_js_confirms_for_phantomjs(facilitator_session)

    submit_idea(facilitator_session, %{category: "happy", body: "it works"})

    assert participant_session |> find(Query.css(".ui.green.button", text: "Vote", count: 0))

    click_and_confirm(facilitator_session, "Proceed to Voting")

    assert participant_session |> find(Query.css(".ui.green.button", text: "Vote"))
  end
end