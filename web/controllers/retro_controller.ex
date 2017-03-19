defmodule RemoteRetro.RetroController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.Retro
  alias Phoenix.Token

  def show(conn, _params) do
    case get_session(conn, "current_user") do
      nil ->
        conn = put_session conn, "requested_endpoint", conn.request_path
        redirect conn, to: "/auth/google"
      user -> render conn, "show.html", %{user_token: Token.sign(conn, "user", user)}
    end
  end

  def create(conn, _params) do
    {:ok, retro} = Repo.insert(%Retro{})
    redirect conn, to: "/retros/" <> retro.id
  end
end
