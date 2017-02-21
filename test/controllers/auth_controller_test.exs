defmodule RemoteRetro.AuthControllerTest do
  use RemoteRetro.ConnCase

  test "GET requests to /auth/google result in redirect to a google account page", %{conn: conn} do
    conn = get conn, "/auth/google"
    assert redirected_to(conn) =~ "https://accounts.google.com/o/oauth2/auth"
  end
end
