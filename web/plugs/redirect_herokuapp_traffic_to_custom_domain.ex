defmodule RedirectHerokuappTrafficToCustomDomain do
  import Plug.Conn
  import Phoenix.Controller

  def init(options) do
    options
  end

  def call(conn, _opts) do
    case conn.host =~ "herokuapp" do
      true ->
        conn
        |> put_status(301)
        |> put_resp_header("Host", "remoteretro.org")
        |> redirect(external: "http://remoteretro.org" <> conn.request_path)
      false ->
        conn
    end
  end
end
