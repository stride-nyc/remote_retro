defmodule SendActionItemToUsersViaEmailTest do
  alias RemoteRetro.Emails
  use RemoteRetro.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  @mock_user Application.get_env(:remote_retro, :mock_user)

  describe "when an action-item already exists in a retro" do
    setup [:persist_user_for_retro, :persist_idea_for_retro]

    @tag [
      idea: %RemoteRetro.Idea{category: "action-item", body: "Get better"},
      retro_stage: "action-items",
      user: Map.put(@mock_user, "email", "action-man@protagonist.com"),
    ]
    test "Distributing action items via email", %{session: facilitator_session, retro: retro} do
      retro_path = "/retros/" <> retro.id
      facilitator_session = authenticate(facilitator_session) |> visit(retro_path)

      click_and_confirm(facilitator_session, "Send Action Items")

      emails = Emails.action_items_email(retro.id)
      assert emails.html_body =~ "Get better (Test User)"

      emails |> assert_delivered_email
    end
  end
end
