defmodule RemoteRetroWeb.AuthController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.OAuth.Google
  alias RemoteRetro.User

  def index(conn, _params) do
    redirect conn, external: authorize_url!()
  end

  def callback(conn, %{"code" => code}) do
    oauth_info = Google.get_user_info!(code)

    {:ok, user} = User.upsert_record_from(oauth_info: oauth_info)
    conn = put_session(conn, :current_user, user)

    redirect conn, to: get_session(conn, "requested_endpoint") || "/"
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "email profile")
  end
end
