defmodule RemoteRetroWeb.Router do
  use RemoteRetroWeb, :router
  use Honeybadger.Plug

  import Phoenix.LiveDashboard.Router

  alias RemoteRetroWeb.{PageController, AuthController, Plugs}

  @live_dashboard_repos Application.get_env(:remote_retro, :live_dashboard_repos)
  @auth_controller Application.get_env(:remote_retro, :auth_controller)

  if Application.get_env(:remote_retro, :env) == :dev do
    forward("/sent_emails", Bamboo.SentEmailViewerPlug)
  end

  pipeline :authentication_required do
    plug(Plugs.RedirectUnauthenticated)
  end

  pipeline :forbid_non_striders do
    plug(Plugs.ForbidNonStriders)
  end

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  scope "/" do
    # Use the default browser stack
    pipe_through(:browser)

    get("/", PageController, :index)
    get("/faq", PageController, :faq)
    get("/privacy", PageController, :privacy)
    get("/auth/google", AuthController, :index)
    get("/auth/google/callback", @auth_controller, :callback)
    get("/logout", AuthController, :logout)
  end

  scope "/retros", RemoteRetroWeb do
    pipe_through([:browser, :authentication_required])

    resources("/", RetroController, only: [:index, :create, :show])
  end

  scope "/admin" do
    pipe_through [:browser, :authentication_required, :forbid_non_striders]
    live_dashboard "/dashboard", metrics: RemoteRetroWeb.Telemetry, ecto_repos: @live_dashboard_repos
  end
end
