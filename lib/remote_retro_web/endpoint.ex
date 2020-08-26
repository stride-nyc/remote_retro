defmodule RemoteRetroWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :remote_retro

  socket("/socket", RemoteRetroWeb.UserSocket, websocket: [timeout: 45_000], longpoll: false)
  socket "/live", Phoenix.LiveView.Socket

  if Application.get_env(:remote_retro, :sql_sandbox) do
    plug(Phoenix.Ecto.SQL.Sandbox)
  end

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug(
    Plug.Static,
    at: "/",
    from: :remote_retro,
    gzip: true,
    only: ~w(css fonts images js favicon.ico robots.txt)
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
    extra: Application.get_env(:remote_retro, :extra_headers)
  )

  plug(RemoteRetroWeb.Router)
end
