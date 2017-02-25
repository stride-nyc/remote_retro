defmodule RemoteRetro.Router do
  use RemoteRetro.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    if Application.get_env(:remote_retro, :add_mock_user_to_session) do
      plug :add_mock_user_to_session
    end
  end

  def add_mock_user_to_session(conn, _options) do
    put_session(conn, :current_user, %{
      "given_name" => "Kris",
      "family_name" => "Tenderloin",
      "email" => "kris@thedevioustenderloin.io",
    })
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
    get "/google/callback", AuthController, :callback
  end
end
