defmodule RemoteRetroWeb.Plugs.ForbidNonStriders do
  import Plug.Conn

  def init(options), do: options

  def call(conn, _opts) do
    %{current_user: current_user} = conn.assigns

    case current_user.email =~ ~r/@stridenyc\.com$/ do
      true ->
        conn
      false ->
        conn
        |> put_resp_content_type("text/plain")
        |> send_resp(403, "403 Forbidden")
        |> halt
    end
  end
end
