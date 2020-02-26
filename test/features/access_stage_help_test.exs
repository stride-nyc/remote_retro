defmodule AccessStageHelpTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  @tag [
    retro_stage: "action-items",
  ]
  test "accessing stage info", ~M{retro, session} do
    retro_path = "/retros/" <> retro.id
    visit(session, retro_path)

    trigger_help(session)

    assert_has(session, Query.css(".ui.modal", text: "The skinny on Action-Item Generation"))
  end

  defp trigger_help(session) do
    click(session, Query.css("i.question"))
  end
end
