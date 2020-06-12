defmodule AccessStageHelpTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  @tag [
    retro_stage: "action-items",
  ]
  test "accessing stage info", ~M{retro, session} do
    session = visit_retro(session, retro)

    trigger_help(session)

    assert_has(session, Query.css(".modal", text: "The skinny on Action-Item Generation"))
  end

  defp trigger_help(session) do
    click(session, Query.css("i.question"))
  end
end
