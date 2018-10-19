defmodule RemoteRetro.AuthControllerTest do
  use RemoteRetroWeb.ConnCase, async: true
  alias RemoteRetro.User

  import ShorterMaps

  setup context do
    if desired_endpoint = context[:desired_endpoint_on_session] do
      %{conn: get(context[:conn], desired_endpoint)}
    else
      context
    end
  end

  test "GET requests to /auth/google result in redirect to a google account page", ~M{conn} do
    conn = get conn, "/auth/google"
    assert redirected_to(conn) =~ "https://accounts.google.com/o/oauth2/auth"
  end

  describe "GET requests to /auth/google/callback" do
    test "result in redirect to root by default", ~M{conn} do
      conn = get conn, "/auth/google/callback?code=herpderp"
      assert redirected_to(conn) =~ "/"
    end

    @tag desired_endpoint_on_session: "/retros/3939akdjf92jh"
    test "result in redirect to a desired endpoint when one exists on session", ~M{conn} do
      conn = get conn, "/auth/google/callback?code=dontmesswiththejesus"
      assert redirected_to(conn) =~ "/retros/3939akdjf92jh"
    end

    test "establish a session", ~M{conn} do
      refute Map.has_key?(conn.private, :plug_session)

      conn = get conn, "/auth/google/callback?code=timtom"

      assert Map.has_key?(conn.private, :plug_session)
    end

    test "set the current_user on the session", ~M{conn} do
      conn = get conn, "/auth/google/callback?code=schlarpdarp"

      session = retrieve_session(conn)
      assert session["current_user"].email == "mrtestuser@one.com"
    end

    test "user on the session exists in the db", ~M{conn} do
      mock_google_info = Application.get_env(:remote_retro, :test_user_one)
      conn = get conn, "/auth/google/callback?code=schlarpdarp"

      session = retrieve_session(conn)

      user = Repo.get_by(User, email: mock_google_info["email"])
      assert user.email == session["current_user"].email
    end

    test "when a user logs in more than once, ensure last_login is updated and doesn't match inserted_at", ~M{conn} do
      conn = get conn, "/auth/google/callback?code=schlarpdarp"
      session = retrieve_session(conn)
      session_email = session["current_user"].email
      user_first_login = Repo.get_by(User, email: session_email)

      conn = conn |> clear_session |> get("/auth/google/callback?code=schlarpdarp")

      session = retrieve_session(conn)
      session_email = session["current_user"].email
      user_second_login = Repo.get_by(User, email: session_email)

      refute user_first_login.last_login == user_second_login.last_login
    end
  end

  describe ".logout" do
    setup :authenticate_connection

    test "it sets session current_user to nil", ~M{conn} do
      assert get_session(conn, "current_user")

      conn = conn
        |> get(auth_path(conn, :logout))

      refute get_session(conn, "current_user")
    end

    test "it redirects the user to /", ~M{conn} do
      conn = conn
        |> get(auth_path(conn, :logout))

      assert redirected_to(conn, 302) == "/"
    end
  end

  defp retrieve_session(conn) do
    conn.private.plug_session
  end
end
