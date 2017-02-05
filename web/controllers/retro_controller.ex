defmodule RemoteRetro.RetroController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.Retro

  def show(conn, _params) do
    render conn, "show.html"
  end

  def create(conn, _params) do
    { :ok, retro } = Repo.insert(%Retro{})
    redirect conn, to: "/retros/" <> retro.id
  end
end
