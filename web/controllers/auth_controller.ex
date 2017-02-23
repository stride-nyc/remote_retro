defmodule RemoteRetro.AuthController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.Google

  def index(conn, _params) do
    redirect conn, external: authorize_url!
  end

  def callback(conn, %{"code" => code}) do
    user = Google.get_token!(code) |> Google.get_user_info!

    conn = put_session(conn, :current_user, user)

    redirect conn, to: "/"
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "email profile")
  end
end
