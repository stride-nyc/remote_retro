defmodule AccessStageHelpTest do
  use RemoteRetro.IntegrationCase, async: false

  @tag [
    retro_stage: "action-items"
  ]
  test "accessing stage info", %{retro: retro, session: session} do
    session = visit_retro(session, retro)

    trigger_help(session)

    assert_has(session, Query.css(".modal", text: "Generate action-items"))
  end

  defp trigger_help(session) do
    click(session, Query.css("i.question"))
  end
end
