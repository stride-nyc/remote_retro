defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetro.ConnCase

  test "POST requests to /retros redirect to the new retro", %{conn: conn} do
    conn = post conn, "/retros"
    assert redirected_to(conn) =~ ~r/\/retros\/.+$/
  end
end
