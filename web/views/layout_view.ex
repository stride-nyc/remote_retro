defmodule RemoteRetro.LayoutView do
  use RemoteRetro.Web, :view

  def app_js(conn) do
    case Mix.env do
      :dev -> "http://localhost:5001/js/app.js"
      _ -> static_path(conn, "/js/app.js")
    end
  end
end
