defmodule RemoteRetroWeb.Router do
  use RemoteRetroWeb, :router
  use Honeybadger.Plug

  alias RemoteRetroWeb.{PageController, AuthController}

  @auth_controller Application.get_env(:remote_retro, :auth_controller)

  if Application.get_env(:remote_retro, :env) == :dev do
    forward("/sent_emails", Bamboo.EmailPreviewPlug)
  end

  pipeline :authentication_required do
    plug(RedirectUnauthenticated)
  end

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_flash)
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
    plug(SetCurrentUser)
  end

  scope "/" do
    # Use the default browser stack
    pipe_through(:browser)

    get("/", PageController, :index)
    get("/faq", PageController, :faq)
    get("/auth/google", AuthController, :index)
    get("/auth/google/callback", @auth_controller, :callback)
    get("/logout", AuthController, :logout)
  end

  scope "/retros", RemoteRetroWeb do
    pipe_through([:browser, :authentication_required])

    resources("/", RetroController, only: [:index, :create, :show])
  end
end
