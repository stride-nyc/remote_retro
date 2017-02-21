defmodule RemoteRetro.Router do
  use RemoteRetro.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
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

    resources "/retros", RetroController, only: [:create, :show]
  end

  scope "/auth", RemoteRetro do
    pipe_through :browser

    get "/google", AuthController, :index
  end
end
