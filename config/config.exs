# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
import Config

# General application configuration
config :remote_retro,
  ecto_repos: [RemoteRetro.Repo],
  env: Mix.env()

config :gettext,
  default_locale: "en",
  default_priv: "priv/gettext"

# Configures the endpoint
config :remote_retro, RemoteRetroWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "mMAbzpoDyu8/YhHYO02sTGhC4RVb2KoqEx1hy0BLtWu8KckeeRz/nFA9TpY+bIaN",
  render_errors: [view: RemoteRetroWeb.ErrorView, accepts: ~w(html json)],
  pubsub_server: RemoteRetro.PubSub,
  live_view: [signing_salt: "FglCNt_sd7C22gLB"]

# Configures Email API
config :remote_retro, RemoteRetro.Mailer, adapter: Bamboo.SendGridAdapter, api_key: System.get_env("SENDGRID_API_KEY")
config :bamboo, :json_library, Jason

config :remote_retro, :auth_controller, RemoteRetroWeb.AuthController
config :remote_retro, :extra_headers, ""

config :oauth2,
  serializers: %{
    "application/json" => Jason,
  }

config :remote_retro,
  datadog_client_token: "",
  datadog_application_id: ""

config :libcluster,
  topologies: []

# Configures HoneyBadger error reporting API
config :honeybadger,
  api_key: "stubDevValue"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :remote_retro, ecto_repos: [RemoteRetro.Repo]
config :remote_retro, live_dashboard_repos: []

config :phoenix,
  json_library: Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
