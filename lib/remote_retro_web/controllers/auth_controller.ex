defmodule RemoteRetroWeb.AuthController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.OAuth.Google
  alias RemoteRetroWeb.UserManagement

  def index(conn, _params) do
    redirect conn, external: authorize_url!()
  end

  def callback(conn, %{"code" => code}) do
    oauth_info = Google.get_user_info!(code)

    {:ok, user} = UserManagement.handle_google_oauth(oauth_info)
    conn = put_session(conn, :current_user, user)

    redirect conn, to: get_session(conn, "requested_endpoint") || "/"
  end

  def logout(conn, _params) do
    conn = put_session(conn, :current_user, nil)
    redirect(conn, to: "/")
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "email profile")
  end
end
