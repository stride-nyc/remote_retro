defmodule SendActionItemToUsersViaEmailTest do
  alias RemoteRetro.Emails
  use RemoteRetro.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  @test_user_one Application.get_env(:remote_retro, :test_user_one)

  describe "when an action-item already exists in a retro" do
    setup [:persist_users_for_retro, :persist_idea_for_retro]

    @tag [
      idea: %RemoteRetro.Idea{category: "action-item", body: "Get better"},
      retro_stage: "action-items",
      users: [@test_user_one]
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
