defmodule RemoteRetroWeb.LayoutView do
  use Phoenix.Template, root: "lib/remote_retro_web/templates", namespace: RemoteRetroWeb

  def app_js(conn) do
    case Application.get_env(:remote_retro, :env) do
      :dev -> "http://localhost:8080/js/app.js"
      _ -> Routes.static_url(conn, "/js/app.js")
    end
  end

  def app_css(conn) do
    case Application.get_env(:remote_retro, :env) do
      :dev -> "http://localhost:8080/css/app.css"
      _ -> Routes.static_url(conn, "/css/app.css")
    end
  end
end
