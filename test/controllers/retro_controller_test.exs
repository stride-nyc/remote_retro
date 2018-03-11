defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetro.ConnCase, async: true
  alias RemoteRetro.{User, Participation, Repo}

  describe "authenticated requests" do
    setup :authenticate_connection

    test "POST requests to /retros redirect to the new retro", %{conn: conn} do
      conn = post conn, "/retros"

      assert redirected_to(conn) =~ ~r/\/retros\/.+$/
    end

    test "joining a retro results in the persistence of a participation", %{conn: conn} do
      participation_count_before = Repo.aggregate(Participation, :count, :id)
      create_retro_and_follow_redirect(conn)
      participation_count_after = Repo.aggregate(Participation, :count, :id)

      participation_count_diff = participation_count_after - participation_count_before
      assert participation_count_diff == 1
    end

    test "rejoining a retro doesn't result in another participation being persisted", %{conn: conn} do
      mock_google_info = Application.get_env(:remote_retro, :test_user_one)
      user = Repo.get_by(User, email: mock_google_info["email"])

      conn = create_retro_and_follow_redirect(conn)

      retro_id = conn.params["id"]

      query = from p in Participation, where: p.user_id == ^user.id and p.retro_id == ^retro_id
      participations = Repo.all(query)

      refute length(participations) > 1
    end

    test "GET requests to /retros welcomes users with no retro experience", %{conn: conn} do
      conn = get conn, "/retros"
      assert conn.resp_body =~ ~r/welcome/i
      refute conn.resp_body =~ ~r/my retros/i
    end

    test "GET requests to /retros lists all retros for a user with retro experience", %{conn: conn} do
      conn = conn
        |> create_retro_and_follow_redirect
        |> get("/retros")

      assert conn.resp_body =~ ~r/my retros/i
      refute conn.resp_body =~ ~r/welcome/i
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
