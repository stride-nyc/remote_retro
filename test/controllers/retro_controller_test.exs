defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetro.ConnCase

  test "POST requests to /retros redirect to the new retro", %{conn: conn} do
    conn = post conn, "/retros"
    assert redirected_to(conn) =~ ~r/\/retros\/.+$/
  end

  describe "unauthenticated GET requests to /retros/some-uuid" do
    test "are redirected to the google account login", %{conn: conn} do
      conn = get conn, "/retros/d83838383ndnd9d9d"
      assert redirected_to(conn) =~ "/auth/google"
    end

    test "store the desired endpoint in the session", %{conn: conn} do
      conn = get conn, "/retros/d83838383ndnd9d9d"
      session = conn.private.plug_session

      assert session["requested_endpoint"] == "/retros/d83838383ndnd9d9d"
    end
  end
end
