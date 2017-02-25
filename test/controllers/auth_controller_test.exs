defmodule RemoteRetro.AuthControllerTest do
  use RemoteRetro.ConnCase

  setup context do
    if desired_endpoint = context[:desired_endpoint_on_session] do
      %{conn: get(context[:conn], desired_endpoint)}
    else
      context
    end
  end

  test "GET requests to /auth/google result in redirect to a google account page", %{conn: conn} do
    conn = get conn, "/auth/google"
    assert redirected_to(conn) =~ "https://accounts.google.com/o/oauth2/auth"
  end

  describe "GET requests to /auth/google/callback" do
    test "result in redirect to root by default", %{conn: conn} do
      conn = get conn, "/auth/google/callback?code=herpderp"
      assert redirected_to(conn) =~ "/"
    end

    @tag desired_endpoint_on_session: "/retros/3939akdjf92jh"
    test "result in redirect to a desired endpoint when one exists on session", %{conn: conn} do
      conn = get conn, "/auth/google/callback?code=dontmesswiththejesus"
      assert redirected_to(conn) =~ "/retros/3939akdjf92jh"
    end

    test "establish a session", %{conn: conn} do
      refute Map.has_key?(conn.private, :plug_session)

      conn = get conn, "/auth/google/callback?code=timtom"

      assert Map.has_key?(conn.private, :plug_session)
    end

    test "set the current_user on the session", %{conn: conn} do
      conn = get conn, "/auth/google/callback?code=schlarpdarp"

      session = retrieve_session(conn)
      assert get_in(session, ["current_user", "email"]) == "mistertestuser@gmail.com"
    end
  end

  defp retrieve_session(conn) do
    conn.private.plug_session
  end
end
