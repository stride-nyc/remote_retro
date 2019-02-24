defmodule FacilitatorHighlightsAnIdeaTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea
  import ShorterMaps

  describe "when the facilitator clicks on the announcement icon for an idea" do
    setup [:persist_idea_for_retro]

    @tag idea: %Idea{category: "happy", body: "Teams worked well together"}
    test "the idea that the facilitator clicked on toggles highlighted class for everyone", ~M{retro, session: facilitator_session, non_facilitator} do
      idea_body = "Teams worked well together"
      participant_session = new_authenticated_browser_session(non_facilitator)

      retro_path = "/retros/#{retro.id}"
      facilitator_session = visit(facilitator_session, retro_path)
      participant_session = visit(participant_session, retro_path)

      idea = participant_session |> find(Query.css("li[title='#{idea_body}']"))
      refute Element.attr(idea, "class") =~ "highlighted"

      facilitator_session |> find(Query.css("li[title='#{idea_body}'] .announcement.icon")) |> Element.click
      assert Element.attr(idea, "class") =~ "highlighted"
    end
  end

end
