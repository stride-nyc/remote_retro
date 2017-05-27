defmodule RemoteRetro.RetroView do
  use RemoteRetro.Web, :view

  def include_backdrop, do: false

  def include_js do
    true
  end
end
