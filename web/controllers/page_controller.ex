defmodule RemoteRetro.PageController do
  use RemoteRetro.Web, :controller

  def index(conn, _params) do
    current_user = get_session(conn, :current_user)

    case current_user do
      nil ->
        render conn, "index.html", %{is_landing_page: true, omit_header: true}
      _user ->
        redirect conn, to: "/retros"
    end
  end

  def faq(conn, _params) do
    render conn, "faq.html"
  end
end
