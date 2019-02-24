defmodule RemoteRetroWeb.AuthController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.{OAuth.Google, User}
  alias RemoteRetroWeb.UserManagement

  @allow_user_masquerade Application.get_env(:remote_retro, :allow_user_masquerade)

  def index(conn, _params) do
    redirect conn, external: authorize_url!()
  end

  # hack for e2e tests to authenticate as a particular user, as we can't post from Google
  def callback(conn, %{"code" => test_user_email, "test_override" => "true"}) do
    case @allow_user_masquerade do
      true ->
        user = Repo.get_by(User, email: test_user_email)
        put_current_user_on_session_and_redirect(conn, user)
      _ ->
        send_resp(conn, 401, "")
    end
  end

  def callback(conn, %{"code" => code}) do
    oauth_info = Google.get_user_info!(code)

    {:ok, user} = UserManagement.handle_google_oauth(oauth_info)

    put_current_user_on_session_and_redirect(conn, user)
  end

  def logout(conn, _params) do
    conn = put_session(conn, :current_user, nil)
    redirect(conn, to: "/")
  end

  defp put_current_user_on_session_and_redirect(conn, user) do
    conn = put_session(conn, :current_user, user)

    redirect conn, to: get_session(conn, "requested_endpoint") || "/"
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "email profile")
  end
end
