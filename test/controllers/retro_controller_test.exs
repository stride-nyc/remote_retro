defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetroWeb.ConnCase, async: true
  alias RemoteRetro.{Participation, Retro, Repo}

  import ShorterMaps

  describe "authenticated requests" do
    setup :authenticate_connection

    test "POST requests to /retros result in the creation of a retro \
      where the current user is the facilitator", ~M{conn} do
      conn = post conn, "/retros"

      retro = Repo.one(from r in Retro, order_by: [desc: r.inserted_at], limit: 1)

      current_user = get_session(conn, "current_user")

      assert retro.facilitator_id == current_user.id
    end

    test "POST requests to /retros redirect to a newly created retro", ~M{conn} do
      conn = post conn, "/retros"

      assert redirected_to(conn) =~ ~r/\/retros\/.+$/
    end

    test "joining a retro results in the persistence of a participation", ~M{conn} do
      participation_count_before = Repo.aggregate(Participation, :count, :id)
      create_retro_and_follow_redirect(conn)
      participation_count_after = Repo.aggregate(Participation, :count, :id)

      participation_count_diff = participation_count_after - participation_count_before
      assert participation_count_diff == 1
    end

    test "rejoining a retro doesn't result in an additional participation being created", ~M{conn} do
      conn = create_retro_and_follow_redirect(conn)
      participation_count_after_first_join = Repo.aggregate(Participation, :count, :id)

      get(conn, "/retros/#{conn.params["id"]}")
      participation_count_after_second_join = Repo.aggregate(Participation, :count, :id)

      participation_count_diff =
        participation_count_after_second_join - participation_count_after_first_join

      assert participation_count_diff == 0
    end

    test "invalid params for participation record results in 500", ~M{conn} do
      conn = create_retro_and_follow_redirect(conn)

      # extra chars break the changeset's UUID validation, causing Ecto to throw
      invalid_uuid_param = "#{conn.params["id"]}kdkdkdkdkdk"

      assert_error_sent 500, fn ->
        get(conn, "/retros/#{invalid_uuid_param}")
      end
    end

    test "GET requests to /retros welcomes users with no retro experience", ~M{conn} do
      conn = get conn, "/retros"
      assert conn.resp_body =~ ~r/welcome/i
      refute conn.resp_body =~ ~r/my retros/i
    end

    test "GET requests to /retros lists all retros for a user with retro experience", ~M{conn} do
      conn = conn
        |> create_retro_and_follow_redirect
        |> get("/retros")

      assert conn.resp_body =~ ~r/my retros/i
      refute conn.resp_body =~ ~r/welcome/i
    end
  end

  describe "unauthenticated GET requests to /retros/some-uuid" do
    test "are redirected to the google account login", ~M{conn} do
      conn = get conn, "/retros/d83838383ndnd9d9d"
      assert redirected_to(conn) =~ "/auth/google"
    end

    test "store the desired endpoint in the session", ~M{conn} do
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
