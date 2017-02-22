defmodule RemoteRetro.AuthController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.Google

  def index(conn, _params) do
    redirect conn, external: authorize_url!
  end

  def callback(conn, %{"code" => code}) do
    redirect conn, to: "/"
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "email profile")
  end
end
