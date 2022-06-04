defmodule RemoteRetroWeb.AuthController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.{OAuth.Google}
  alias RemoteRetroWeb.UserManagement

  def index(conn, _params) do
    redirect(conn, external: authorize_url!())
  end

  def callback(conn, %{"code" => code}) do
    oauth_info = Google.get_user_info!(code)

    {:ok, user} = UserManagement.handle_google_oauth(oauth_info)

    conn =
      conn
      |> put_session("current_user_id", user.id)
      |> put_session("current_user_given_name", user.given_name)

    redirect(conn, to: get_session(conn, "requested_endpoint") || "/retros")
  end

  def logout(conn, _params) do
    conn = clear_session(conn)
    redirect(conn, to: "/")
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile")
  end
end
