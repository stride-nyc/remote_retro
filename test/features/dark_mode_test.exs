defmodule DarkModeTest do
  use RemoteRetro.IntegrationCase, async: false

  import ShorterMaps

  @tag [retro_stage: "idea-generation"]
  test "user can enable dark mode by clicking the toggle", ~M{retro, session} do
    session = visit_retro(session, retro)

    click(session, Query.css(".dark-mode-toggle"))

    assert_has(session, Query.css("html[data-theme='dark']"))
  end

  @tag [retro_stage: "idea-generation"]
  test "clicking the toggle a second time restores light mode", ~M{retro, session} do
    session = visit_retro(session, retro)

    click(session, Query.css(".dark-mode-toggle"))
    click(session, Query.css(".dark-mode-toggle"))

    refute_has(session, Query.css("html[data-theme='dark']"))
  end

  test "the toggle is reachable on pages that omit the branded header", ~M{session} do
    # the landing page is the header-less page, and it only renders for signed-out users
    session = visit(session, "/logout")
    session = visit(session, "/")

    click(session, Query.css(".dark-mode-toggle.headerless"))

    assert_has(session, Query.css("html[data-theme='dark']"))
  end

  @tag [retro_stage: "idea-generation"]
  test "the chosen theme survives navigation to another page", ~M{retro, session} do
    session = visit_retro(session, retro)
    click(session, Query.css(".dark-mode-toggle"))

    session = visit(session, "/faq")

    assert_has(session, Query.css("html[data-theme='dark']"))
  end
end
