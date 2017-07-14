# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :remote_retro,
  ecto_repos: [RemoteRetro.Repo]

# Configures the endpoint
config :remote_retro, RemoteRetro.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "O3MLJ1Bu2p3iEKTRu9DsKQj7ahKyfBfvTxQfW5HehdWt/NtN3ffL1LsAStFlg8Y06",
  render_errors: [view: RemoteRetro.ErrorView, accepts: ~w(html json)],
  pubsub: [name: RemoteRetro.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Email API
config :remote_retro, RemoteRetro.Mailer, adapter: Bamboo.SendgridAdapter, api_key: System.get_env("SENDGRID_API_KEY")

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :remote_retro, ecto_repos: [RemoteRetro.Repo]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
