defmodule RemoteRetro.AuthControllerTest do
  use RemoteRetro.ConnCase

  test "GET requests to /auth/google result in redirect to a google account page", %{conn: conn} do
    conn = get conn, "/auth/google"
    assert redirected_to(conn) =~ "https://accounts.google.com/o/oauth2/auth"
  end

  describe "GET requests to /auth/google/callback" do
    test "result in redirect to root", %{conn: conn} do
      conn = get conn, "/auth/google/callback?code=herpderp"
      assert redirected_to(conn) =~ "/"
    end
  end
end
