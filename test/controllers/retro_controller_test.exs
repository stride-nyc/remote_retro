defmodule RemoteRetro.RetroControllerTest do
  use RemoteRetro.ConnCase, async: true
  alias RemoteRetro.{User, Participation}
  alias Phoenix.Token

  describe "authenticated requests" do
    setup :authenticate_connection

    test "POST requests to /retros redirect to the new retro", %{conn: conn} do
      conn = post conn, "/retros"

      assert redirected_to(conn) =~ ~r/\/retros\/.+$/
    end

    test "joining a retro results in a the persistence of a participation", %{conn: conn} do
      mock_google_info = Application.get_env(:remote_retro, :mock_user)
      user = Repo.get_by(User, email: mock_google_info["email"])

      conn = post conn, "/retros"
      location = get_resp_header(conn, "location")
      get conn, "#{location}"

      participation = Repo.get_by(Participation, user_id: user.id)

      assert participation.user_id == user.id
    end

    test "rejoining a retro doesn't result in a participation being persisted", %{conn: conn} do
      mock_google_info = Application.get_env(:remote_retro, :mock_user)
      user = Repo.get_by(User, email: mock_google_info["email"])

      conn = post conn, "/retros"
      location = get_resp_header(conn, "location")
      conn = get conn, "#{location}"
      get conn, "#{location}"

      retro_id = conn.params["id"]

      query = from p in Participation, where: p.user_id == ^user.id and p.retro_id == ^retro_id
      participations = Repo.all(query)

      refute length(participations) > 1
    end

    test "ensure that the tokenized user added to assigns is given a vote count", %{conn: conn} do
      conn = post conn, "/retros"
      location = get_resp_header(conn, "location")
      conn = get conn, "#{location}"
      %{user_token: user_token} = conn.assigns

      {:ok, tokenized_user} = Token.verify(conn, "user", user_token)
      assert Map.has_key?(tokenized_user, :vote_count)
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
end
