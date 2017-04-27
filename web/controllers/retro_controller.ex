defmodule RemoteRetro.RetroController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.{Retro, Participation}
  alias Phoenix.Token

  def show(conn, params) do
    case get_session(conn, "current_user") do
      nil ->
        conn = put_session conn, "requested_endpoint", conn.request_path
        redirect conn, to: "/auth/google"
      user ->
        query = from p in Participation, where: p.user_id == ^user.id and p.retro_id == ^params["id"]
        changeset = Participation.changeset(%Participation{}, %{
          user_id: user.id,
          retro_id: params["id"]
        })
        Repo.one(query) || Repo.insert!(changeset)

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
