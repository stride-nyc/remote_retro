defmodule RemoteRetro.RetroController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.Retro
  alias RemoteRetro.Participation
  alias RemoteRetro.User
  alias Phoenix.Token

  def show(conn, params) do
    case get_session(conn, "current_user") do
      nil ->
        conn = put_session conn, "requested_endpoint", conn.request_path
        redirect conn, to: "/auth/google"
      user ->
        user_from_db = Repo.get_by(User, email: user["email"])
        changeset = Participation.changeset(
          %Participation{},
          %{
            user_id: user_from_db.id,
            retro_id: params["id"]
          }
        )
        Repo.insert!(changeset)
        render conn, "show.html", %{
          user_token: Token.sign(conn, "user", user),
          retro_uuid: params["id"]
        }
    end
  end

  def create(conn, _params) do
    {:ok, retro} = Repo.insert(%Retro{})
    redirect conn, to: "/retros/" <> retro.id
  end
end
