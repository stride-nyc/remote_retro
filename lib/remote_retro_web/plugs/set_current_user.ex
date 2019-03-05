defmodule SetCurrentUser do
  import Plug.Conn

  def init(options) do
    options
  end

  def call(conn, _) do
    conn
    |> assign(:current_user, get_session(conn, :current_user))
  end
end
