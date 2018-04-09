defmodule RemoteRetroWeb.LayoutView do
  use RemoteRetroWeb, :view

  def app_js(conn) do
    case Application.get_env(:remote_retro, :env) do
      :dev -> "http://localhost:5001/js/app.js"
      _ -> static_path(conn, "/js/app.js")
    end
  end
end
