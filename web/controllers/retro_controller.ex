defmodule RemoteRetro.RetroController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.{Retro, Participation, User}
  alias Phoenix.Token

  def show(conn, params) do
    user = get_session(conn, "current_user")
    user_from_db = Repo.get_by(User, email: user["email"])
    query = from p in Participation, where: p.user_id == ^user_from_db.id and p.retro_id == ^params["id"]
    changeset = Participation.changeset(%Participation{}, %{
      user_id: user_from_db.id,
      retro_id: params["id"]
    })
    Repo.one(query) || Repo.insert!(changeset)

    render conn, "show.html", %{
      user_token: Token.sign(conn, "user", user),
      retro_uuid: params["id"]
    }
  end

  def create(conn, _params) do
    {:ok, retro} = Repo.insert(%Retro{})
    redirect conn, to: "/retros/" <> retro.id
  end
end
