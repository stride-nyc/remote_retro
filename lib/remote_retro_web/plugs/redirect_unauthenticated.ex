defmodule RedirectUnauthenticated do
  import Plug.Conn
  import Phoenix.Controller

  def init(options) do
    options
  end

  def call(conn, _opts) do
    case get_session(conn, "current_user") do
      nil ->
        conn = put_session conn, "requested_endpoint", conn.request_path
        redirect(conn, to: "/auth/google") |> halt
      _user ->
        conn
    end
  end
end
