defmodule RemoteRetroWeb.RetroView do
  use Phoenix.Template, root: "lib/remote_retro_web/templates", namespace: RemoteRetroWeb
  import RemoteRetroWeb.IdeaView
  import RemoteRetroWeb.LayoutView, only: [app_js: 1]
end
