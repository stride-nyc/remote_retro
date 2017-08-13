defmodule SendActionItemToUsersViaEmailTest do
  alias RemoteRetro.{Emails, Idea}
  use RemoteRetro.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  @mock_user Application.get_env(:remote_retro, :mock_user)

  describe "when an idea already exists in a retro" do
    setup [:persist_user_for_retro, :persist_idea_for_retro]

    @tag user: Map.put(@mock_user, "email", "travy@davy.com")
    @tag idea: %Idea{category: "happy", body: "Teams worked well together"}
    test "Distributing action items via email", %{session: facilitator_session, retro: retro} do
      retro_path = "/retros/" <> retro.id
      idea_text = "Do the test"
      facilitator_session = authenticate(facilitator_session) |> visit(retro_path)
      click_and_confirm(facilitator_session, "Proceed to Action Items")

      submit_idea(facilitator_session, %{category: "action-item", body: idea_text})

      assert facilitator_session |> find(Query.css("ul.action-item li[title='#{idea_text}']", count: 1))
      click_and_confirm(facilitator_session, "Send Action Items")

      Emails.action_items_email(retro.id) |> assert_delivered_email
    end
  end
end
