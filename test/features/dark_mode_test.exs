defmodule DarkModeTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  @tag [retro_stage: "idea-generation"]
  test "user can enable dark mode by clicking the toggle", ~M{retro, session} do
    session = visit_retro(session, retro)

    click(session, Query.css(".dark-mode-toggle"))

    assert_has(session, Query.css("html[data-theme='dark']"))
  end
end
