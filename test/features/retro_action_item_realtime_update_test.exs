defmodule RetroActionItemRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  @mock_user Application.get_env(:remote_retro, :mock_user)

  describe "when an action-item is created" do
    setup [:persist_user_for_retro]

    @tag [
      retro_stage: "action-items",
      user: Map.put(@mock_user, "email", "action-man@protagonist.com"),
    ]
    test "it is assigned to a particular user", %{session: facilitator_session, retro: retro} do
      retro_path = "/retros/" <> retro.id
      facilitator_session = authenticate(facilitator_session) |> visit(retro_path)

      facilitator_session
      |> find(Query.css("form"))
      |> click(Query.option("Test User"))
      |> fill_in(Query.text_field("idea"), with: "let's do the thing!")
      |> click(Query.button("Submit"))

      action_items_list_text = facilitator_session |> find(Query.css(".action-item.column")) |> Element.text()
      assert String.contains?(action_items_list_text, "let's do the thing! (Travis Vander Hoop)")
    end
  end
end
