defmodule SendActionItemToUsersViaEmailTest do
  alias RemoteRetro.{Emails, Idea}
  use RemoteRetro.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  describe "retros that have advanced to the action item stage without grouping" do
    @tag [
      retro_stage: "action-items",
    ]
    test "allow action item creation and distribution", %{retro: retro, session: facilitator_session, non_facilitator: non_facilitator} do
      facilitator_session = visit_retro(facilitator_session, retro)

      # ensure non-facilitator has joined/is available as an assignee
      new_authenticated_browser_session(non_facilitator) |> visit_retro(retro)

      submit_action_item(facilitator_session, %{assignee_name: non_facilitator.name, body: "Get better"})

      click_and_confirm_progression_to(facilitator_session, "Send Action Items")

      emails = Emails.action_items_email(retro.id)
      assert emails.html_body =~ ~r/Get better \(Monsieur User\)/

      emails |> assert_delivered_email
    end
  end

  describe "retros that have advanced to the action item stage through grouping" do
    setup [:persist_group_for_retro, :persist_idea_for_retro, :add_idea_to_group]

    @tag [
      retro_stage: "groups-action-items",
      idea: %Idea{category: "happy", body: "Frequent Pairing"},
    ]
    test "allow action item creation and distribution", %{retro: retro, session: facilitator_session, non_facilitator: non_facilitator} do
      facilitator_session = visit_retro(facilitator_session, retro)

      # ensure non-facilitator has joined/is available as an assignee
      new_authenticated_browser_session(non_facilitator) |> visit_retro(retro)

      submit_action_item(facilitator_session, %{assignee_name: non_facilitator.name, body: "Eat more fish"})

      click_and_confirm_progression_to(facilitator_session, "Send Action Items")

      emails = Emails.action_items_email(retro.id)
      assert emails.html_body =~ ~r/Eat more fish \(Monsieur User\)/

      emails |> assert_delivered_email
    end
  end
end
