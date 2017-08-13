defmodule StageProgressionRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  @mock_user Application.get_env(:remote_retro, :mock_user)

  describe "when an idea already exists in a retro" do
    setup [:persist_user_for_retro, :persist_idea_for_retro]

    @tag user: Map.put(@mock_user, "email", "travy@davy.com")
    @tag idea: %RemoteRetro.Idea{category: "happy", body: "Teams worked well together"}
    test "realtime stage progression for connected users", %{session: facilitator_session, retro: retro} do
      participant_session = new_browser_session()

      retro_path = "/retros/" <> retro.id
      facilitator_session = authenticate(facilitator_session) |> visit(retro_path)
      participant_session = authenticate(participant_session) |> visit(retro_path)
      stub_js_confirms_for_phantomjs(facilitator_session)

      assert participant_session |> find(Query.css(".action-item.column", count: 0))

      click_and_confirm(facilitator_session, "Proceed to Action Items")

      assert participant_session |> find(Query.css(".action-item.column", count: 1))
    end
  end
end
