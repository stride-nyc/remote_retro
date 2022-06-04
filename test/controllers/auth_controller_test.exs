defmodule RemoteRetro.AuthControllerTest do
  use RemoteRetroWeb.ConnCase, async: true

  import ShorterMaps

  setup context do
    if desired_endpoint = context[:desired_endpoint_on_session] do
      %{conn: get(context[:conn], desired_endpoint)}
    else
      context
    end
  end

  test "GET requests to /auth/google result in redirect to a google account page", ~M{conn} do
    conn = get(conn, "/auth/google")
    assert redirected_to(conn) =~ "https://accounts.google.com/o/oauth2/auth"
  end

  describe "GET requests to /auth/google/callback" do
    test "result in redirect to root by default", ~M{conn} do
      conn = get(conn, "/auth/google/callback?code=herpderp")
      assert redirected_to(conn) =~ "/"
    end

    @tag desired_endpoint_on_session: "/retros/3939akdjf92jh"
    test "result in redirect to a desired endpoint when one exists on session", ~M{conn} do
      conn = get(conn, "/auth/google/callback?code=dontmesswiththejesus")
      assert redirected_to(conn) =~ "/retros/3939akdjf92jh"
    end

    test "establish a session", ~M{conn} do
      refute Map.has_key?(conn.private, :plug_session)

      conn = get(conn, "/auth/google/callback?code=timtom")

      assert Map.has_key?(conn.private, :plug_session)
    end

    test "sets the current user's id on the session", ~M{conn} do
      conn = get(conn, "/auth/google/callback?code=schlarpdarp")
      session = retrieve_session(conn)

      assert is_integer(session["current_user_id"])
    end

    test "sets the current user's given_name on the session", ~M{conn} do
      conn = get(conn, "/auth/google/callback?code=schlarpdarp")
      session = retrieve_session(conn)

      assert session["current_user_given_name"] == "Test"
    end
  end

  describe ".logout" do
    test "clears the session", ~M{conn} do
      conn = Plug.Test.init_test_session(conn, %{
        "current_user_id" => 1,
        "current_user_given_name" => "some string"
      })

      session_attributes_count_before = get_session_attribute_count(conn)
      assert session_attributes_count_before == 2

      conn =
        conn
        |> get(Routes.auth_path(conn, :logout))

      session_attributes_count_after = get_session_attribute_count(conn)
      assert session_attributes_count_after == 0
    end

    test "redirects the user to /", ~M{conn} do
      conn =
        conn
        |> get(Routes.auth_path(conn, :logout))

      assert redirected_to(conn, 302) == "/"
    end
  end

  defp retrieve_session(conn) do
    conn.private.plug_session
  end

  defp get_session_attribute_count(conn) do
    conn |> retrieve_session() |> Enum.count()
  end
end
