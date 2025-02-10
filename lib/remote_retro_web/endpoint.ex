defmodule RemoteRetroWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :remote_retro

  socket("/socket", RemoteRetroWeb.UserSocket, websocket: [timeout: 45_000], longpoll: false)
  socket "/live", Phoenix.LiveView.Socket

  if Application.compile_env(:remote_retro, :sql_sandbox, []) do
    plug(Phoenix.Ecto.SQL.Sandbox)
  end

  plug(:canonical_host)

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug(
    Plug.Static,
    at: "/",
    from: :remote_retro,
    headers: [{"access-control-allow-origin", "*"}],
    brotli: true,
    gzip: true,
    only: ~w(css fonts images js favicon.ico robots.txt sitemap.xml),
    # ensure fonts from semantic ui node module are cached via HTTP-caching
    cache_control_for_etags: "public, max-age=31536000"
  )

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket("/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket)
    plug(Phoenix.LiveReloader)
    plug(Phoenix.CodeReloader)
  end

  plug(
    Phoenix.LiveDashboard.RequestLogger,
    param_key: "request_logger",
    cookie_key: "request_logger"
  )

  plug(Plug.RequestId)
  plug(Plug.Logger)

  plug(
    Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()
  )

  plug(Plug.MethodOverride)
  plug(Plug.Head)

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  plug(
    Plug.Session,
    store: :cookie,
    key: "_remote_retro_key",
    signing_salt: "D76dW6Sl",
    extra: Application.compile_env(:remote_retro, :extra_headers, [])
  )

  plug(RemoteRetroWeb.Router)

  defp canonical_host(conn, _opts) do
    :remote_retro
    |> Application.get_env(:canonical_host)
    |> case do
      host when is_binary(host) ->
        opts = PlugCanonicalHost.init(canonical_host: host)
        PlugCanonicalHost.call(conn, opts)

      _ ->
        conn
    end
  end
end
