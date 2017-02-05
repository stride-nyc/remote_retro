defmodule RetroCreationTest do
  use RemoteRetro.IntegrationCase, async: false

  test "retro creation", %{session: session_one} do
    current_path =
      visit(session_one, "/")
      |> click_button("Create a Retrospective")
      |> get_current_path

    assert current_path =~ ~r/^\/retros\/.+$/i
  end
end
