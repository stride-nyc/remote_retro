defmodule RemoteRetro.Router do
  use RemoteRetro.Web, :router

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

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", RemoteRetro do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/auth/google", AuthController, :index
    get "/auth/google/callback", AuthController, :callback
  end

  scope "/retros", RemoteRetro do
    pipe_through [:browser, :authentication_required]

    resources "/", RetroController, only: [:create, :show]
  end
end
