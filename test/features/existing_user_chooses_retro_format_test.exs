defmodule ExistingUserChoosesRetroFormatTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  describe "a user with prior retro experience" do
    setup [:ensure_user_has_prior_retro_experience]

    test "is allowed to choose a retro format upon creation", ~M{session} do
      visit(session, "/retros")

      click(session, Query.css("button", text: "Create a Retrospective!"))

      assert_has(session, Query.css(".retro-format-modal"))
      assert_has(session, Query.css("input#happy-sad-confused:checked"))

      click(session, Query.css("label[for='start-stop-continue']"))
      click(session, Query.button("Let's do it!"))

      dismiss_share_retro_link_modal(session)

      click_and_confirm_progression_to(session, "Begin Retro")
      click(session, Query.css("button", text: "Got it!"))

      click_and_confirm_progression_to(session, "Idea Generation")

      assert_has(session, Query.css(".modal", text: "Suggest practices that the team could start, stop, or continue"))
      click(session, Query.css("button", text: "Got it!"))

      assert_has(session, Query.css(".start.column"))
    end
  end

  defp ensure_user_has_prior_retro_experience(~M{session, retro} = context) do
    visit_retro(session, retro)

    context
  end

  defp dismiss_share_retro_link_modal(session) do
    click(session, Query.css("button .close.icon"))
  end
end
