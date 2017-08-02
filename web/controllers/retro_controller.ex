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
        find_or_insert_participation_record(user, params["id"])
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

  defp find_or_insert_participation_record(user, retro_id) do
    query = from p in Participation, where: p.user_id == ^user.id and p.retro_id == ^retro_id
    changeset = Participation.changeset(%Participation{}, %{
      user_id: user.id,
      retro_id: retro_id
    })

    Repo.one(query) || Repo.insert!(changeset)
  end
end
