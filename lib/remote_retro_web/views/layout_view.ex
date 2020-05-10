defmodule RemoteRetroWeb.LayoutView do
  use RemoteRetroWeb, :view

  def app_js(conn) do
    Routes.static_path(conn, "/js/app.js")
  end

  def app_css(conn) do
    Routes.static_path(conn, "/css/app.css")
  end
end
