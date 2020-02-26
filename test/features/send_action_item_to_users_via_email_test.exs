defmodule SendActionItemToUsersViaEmailTest do
  alias RemoteRetro.{Emails, Idea}
  use RemoteRetro.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  import ShorterMaps

  describe "retros that have advanced to the action item stage without grouping" do
    @tag [
      retro_stage: "action-items",
    ]
    test "allow action item creation and distribution", ~M{retro, session: facilitator_session, facilitator} do
      retro_path = "/retros/" <> retro.id
      facilitator_session = visit(facilitator_session, retro_path)

      submit_action_item(facilitator_session, %{assignee_name: facilitator.name, body: "Get better"})

      click_and_confirm_progression_to(facilitator_session, "Send Action Items")

      emails = Emails.action_items_email(retro.id)
      assert emails.html_body =~ ~r/Get better \(Test User .*\)/

      emails |> assert_delivered_email
    end
  end

  describe "retros that have advanced to the action item stage through grouping" do
    setup [:persist_group_for_retro, :persist_idea_for_retro, :add_idea_to_group]

    @tag [
      retro_stage: "groups-action-items",
      idea: %Idea{category: "happy", body: "Frequent Pairing"},
    ]
    test "allow action item creation and distribution", ~M{retro, session: facilitator_session, facilitator} do
      retro_path = "/retros/" <> retro.id
      facilitator_session = visit(facilitator_session, retro_path)

      submit_action_item(facilitator_session, %{assignee_name: facilitator.name, body: "Eat more fish"})

      click_and_confirm_progression_to(facilitator_session, "Send Action Items")

      emails = Emails.action_items_email(retro.id)
      assert emails.html_body =~ ~r/Eat more fish \(Test User .*\)/

      emails |> assert_delivered_email
    end
  end
end
