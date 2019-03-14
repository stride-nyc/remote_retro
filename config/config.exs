# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :remote_retro,
  ecto_repos: [RemoteRetro.Repo],
  env: Mix.env()

# Configures the endpoint
config :remote_retro, RemoteRetroWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "6ui3X7f7bC31SgHyMUXXzRp1MjYOROvNkrpVrdBL/ZZdh97cS4iFIp9JXwfwmsIj",
  render_errors: [view: RemoteRetroWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: RemoteRetro.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Email API
config :remote_retro, RemoteRetro.Mailer, adapter: Bamboo.SendGridAdapter, api_key: System.get_env("SENDGRID_API_KEY")

config :remote_retro, :auth_controller, RemoteRetroWeb.AuthController

config :oauth2,
  serializers: %{
    "application/json" => Jason,
  }

# Configures HoneyBadger error reporting API
config :honeybadger,
  api_key: "stubDevValue"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :remote_retro, ecto_repos: [RemoteRetro.Repo]

config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
