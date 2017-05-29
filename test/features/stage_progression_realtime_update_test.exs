defmodule StageProgressionRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  test "realtime stage progression for connected users", %{session: facilitator_session, retro: retro} do
    participant_session = new_browser_session()

    retro_path = "/retros/" <> retro.id
    facilitator_session = authenticate(facilitator_session) |> visit(retro_path)
    participant_session = authenticate(participant_session) |> visit(retro_path)
    stub_js_confirms_for_phantomjs(facilitator_session)

    assert participant_session |> find(Query.css(".action-item.column", count: 0))

    proceed_to_action_items_stage(facilitator_session)

    assert participant_session |> find(Query.css(".action-item.column", count: 1))
  end
end
