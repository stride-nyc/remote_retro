defmodule RemoteRetro.PageController do
  use RemoteRetro.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
