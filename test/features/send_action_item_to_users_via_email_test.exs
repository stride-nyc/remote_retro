defmodule SendActionItemToUsersViaEmailTest do
  use RemoteRetro.IntegrationCase, async: false
  use Bamboo.Test, shared: true

  test "Distributing action items via email", %{session: facilitator_session, retro: retro} do
    retro_path = "/retros/" <> retro.id
    idea_text = "Do the test"
    facilitator_session = authenticate(facilitator_session) |> visit(retro_path)
    stub_js_confirms_for_phantomjs(facilitator_session)

    facilitator_session
    |> find(Query.button("Proceed to Action Items"))
    |> Element.click

    facilitator_session
    |> submit_idea(%{ category: "action-item", body: idea_text })

    assert facilitator_session |> find(Query.css("ul.action-item li[title='#{idea_text}']", count: 1))

    facilitator_session
    |> find(Query.button("Send Action Items"))
    |> Element.click

    assert_delivered_with(subject: "Action items from Retro", html_body: idea_text)
  end
end
