defmodule RemoteRetroWeb.Plugs.RedirectUnauthenticated do
  import Plug.Conn
  import Phoenix.Controller

  def init(options) do
    options
  end

  def call(conn, _opts) do
    case get_session(conn, "current_user_id") do
      nil ->
        conn
      _user ->
        conn
    end
  end
end
