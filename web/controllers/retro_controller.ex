defmodule RemoteRetro.RetroController do
  use RemoteRetro.Web, :controller

  def show(conn, _params) do
    render conn, "show.html"
  end

  def create(conn, _params) do
    uuid = Ecto.UUID.generate
    redirect conn, to: "/retros/" <> uuid
  end
end
