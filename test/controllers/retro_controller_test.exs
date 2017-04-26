defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetro.ConnCase, async: true
  alias RemoteRetro.User
  alias RemoteRetro.Participation


  test "POST requests to /retros redirect to the new retro", %{conn: conn} do
    conn = post conn, "/retros"
    assert redirected_to(conn) =~ ~r/\/retros\/.+$/
  end

  test "authenticated user that joins a retro has a participation persisted", %{conn: conn} do
    conn = get conn, "/auth/google/callback?code=schlarpdarp"
    mock_google_info = Application.get_env(:remote_retro, :mock_user)
    user = Repo.get_by(User, email: mock_google_info["email"])

    conn = post conn, "/retros"
    location = get_resp_header(conn, "location")
    get conn, "#{location}"

    participation = Repo.get_by(Participation, user_id: user.id)

    assert participation.user_id == user.id
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
