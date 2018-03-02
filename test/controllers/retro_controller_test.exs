defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetro.ConnCase, async: true
  alias RemoteRetro.{User, Participation}

  describe "authenticated requests" do
    setup :authenticate_connection

    test "POST requests to /retros redirect to the new retro", %{conn: conn} do
      conn = post conn, "/retros"

      assert redirected_to(conn) =~ ~r/\/retros\/.+$/
    end

    test "joining a retro results in a the persistence of a participation", %{conn: conn} do
      mock_google_info = Application.get_env(:remote_retro, :test_user_one)
      user = Repo.get_by(User, email: mock_google_info["email"])

      create_retro_and_follow_redirect(conn)

      participation = Repo.get_by(Participation, user_id: user.id)

      assert participation.user_id == user.id
    end

    test "rejoining a retro doesn't result in a participation being persisted", %{conn: conn} do
      mock_google_info = Application.get_env(:remote_retro, :test_user_one)
      user = Repo.get_by(User, email: mock_google_info["email"])

      conn = create_retro_and_follow_redirect(conn)

      retro_id = conn.params["id"]

      query = from p in Participation, where: p.user_id == ^user.id and p.retro_id == ^retro_id
      participations = Repo.all(query)

      refute length(participations) > 1
    end
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

  defp create_retro_and_follow_redirect(conn) do
    conn = post conn, "/retros"
    location = get_resp_header(conn, "location")
    get conn, "#{location}"
  end
end
