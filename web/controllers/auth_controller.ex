defmodule RemoteRetro.AuthController do
  use RemoteRetro.Web, :controller

  alias RemoteRetro.OAuth

  def index(conn, _params) do
    redirect conn, external: authorize_url!()
  end

  def callback(conn, %{"code" => code}) do
    user = OAuth.Google.retrieve_internal_user(code)
    conn = put_session(conn, :current_user, user)

    redirect conn, to: get_session(conn, "requested_endpoint") || "/"
  end

  defp authorize_url! do
    OAuth.Google.authorize_url!(scope: "email profile")
  end
end
