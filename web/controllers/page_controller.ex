defmodule RemoteRetro.PageController do
  use RemoteRetro.Web, :controller

  def index(conn, _params) do
    current_user = get_session(conn, :current_user)

    conn = assign(conn, :current_user, current_user)
    render conn, "index.html", %{omit_header: true}
  end

  def faq(conn, _params) do
    render conn, "faq.html"
  end
end
