defmodule ActionItemReviewInDashboardTest do
  alias RemoteRetro.{Idea}
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  describe "when a user has participated in a retro with action items" do
    setup [:persist_idea_for_retro, :log_participation_in_retro]

    @tag [
      idea: %Idea{category: "action-item", body: "review action items from retro after standup"},
      retro_stage: "action-items",
    ]
    test "those action items are reviewable in their dashboard", ~M{session: facilitator_session} do
      facilitator_session = visit(facilitator_session, "/retros")

      click(facilitator_session, Query.css(".action-items-label"))

      assert_has(facilitator_session, Query.css(".nested-action-items-list", text: "review action items from retro after standup"))
    end
  end

  defp log_participation_in_retro(~M{retro, session} = context) do
    retro_path = "/retros/" <> retro.id
    visit(session, retro_path)

    context
  end
end
