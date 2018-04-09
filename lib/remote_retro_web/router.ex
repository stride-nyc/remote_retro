defmodule RemoteRetroWeb.Router do
  use RemoteRetroWeb, :router
  use Honeybadger.Plug

  if Application.get_env(:remote_retro, :env) == :dev do
    forward "/sent_emails", Bamboo.EmailPreviewPlug
  end

  pipeline :authentication_required do
    plug RedirectUnauthenticated
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug RedirectHerokuappTrafficToCustomDomain
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/", RemoteRetroWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/faq", PageController, :faq
    get "/auth/google", AuthController, :index
    get "/auth/google/callback", AuthController, :callback
  end

  scope "/retros", RemoteRetroWeb do
    pipe_through [:browser, :authentication_required]

    resources "/", RetroController, only: [:index, :create, :show]
  end
end
