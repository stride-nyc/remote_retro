defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetroWeb.ConnCase, async: true
  alias RemoteRetro.{Participation, Retro, Repo}

  import ShorterMaps

  describe "authenticated requests" do
    setup :authenticate_connection

    test "POST requests to /retros result in the creation of a retro \
      of the given format where the current user is the facilitator",
         ~M{conn} do
      conn = post(conn, "/retros", %{"format" => "Start/Stop/Continue"})

      retro = Repo.one(from(r in Retro, order_by: [desc: r.inserted_at], limit: 1))

      current_user_id = get_session(conn, "current_user_id")

      assert %Retro{
               facilitator_id: ^current_user_id,
               format: "Start/Stop/Continue"
             } = retro
    end

    test "POST requests to /retros redirect to a newly created retro", ~M{conn} do
      conn = post(conn, "/retros")

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

      participation_count_diff = participation_count_after_second_join - participation_count_after_first_join

      assert participation_count_diff == 0
    end

    test "visits to a retro append a 'retro-show-page' class to the body element", ~M{conn} do
      conn = create_retro_and_follow_redirect(conn)

      get(conn, "/retros/#{conn.params["id"]}")

      assert html_response(conn, 200) =~ ~r/body .*class="retro-show-page".*>/i
    end

    test "visits to a retro preload the user's photo", ~M{conn} do
      conn = create_retro_and_follow_redirect(conn)

      get(conn, "/retros/#{conn.params["id"]}")

      assert html_response(conn, 200) =~ ~r/link rel="preload" as="image".*href=".*googleusercontent.*"\/>/i
    end

    test "invalid uuids passed to the show page result in an informative 404", ~M{conn} do
      conn = create_retro_and_follow_redirect(conn)

      invalid_uuid_param = "#{conn.params["id"]}kdkdkdkdkdk"

      conn = get(conn, "/retros/#{invalid_uuid_param}")

      assert html_response(conn, 404) =~ ~r/no retro here/i
    end

    test "GET requests to /retros welcomes users with no retro experience", ~M{conn} do
      conn = get(conn, "/retros")
      assert conn.resp_body =~ ~r/welcome/i
      refute conn.resp_body =~ ~r/my retros/i
    end

    test "GET requests to /retros lists all retros for a user with retro experience", ~M{conn} do
      conn =
        conn
        |> create_retro_and_follow_redirect
        |> get("/retros")

      assert conn.resp_body =~ ~r/my retros/i
      refute conn.resp_body =~ ~r/welcome/i
    end
  end

  describe "unauthenticated GET requests to /retros/some-uuid" do
    test "are redirected to the google account login", ~M{conn} do
      conn = get(conn, "/retros/d83838383ndnd9d9d")
      assert redirected_to(conn) =~ "/auth/google"
    end

    test "store the desired endpoint in the session", ~M{conn} do
      conn = get(conn, "/retros/d83838383ndnd9d9d")
      session = conn.private.plug_session

      assert session["requested_endpoint"] == "/retros/d83838383ndnd9d9d"
    end
  end

  defp create_retro_and_follow_redirect(conn) do
    conn = post(conn, "/retros")
    location = get_resp_header(conn, "location")
    get(conn, "#{location}")
  end
end
