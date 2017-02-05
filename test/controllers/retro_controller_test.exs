defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetro.ConnCase

  test "POST requests to /retros end in redirect", %{conn: conn} do
    conn = post conn, "/retros"
    assert conn.status == 302
  end
end
