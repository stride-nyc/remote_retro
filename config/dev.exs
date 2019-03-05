use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :remote_retro, RemoteRetroWeb.Endpoint,
  http: [port: 4000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [npm: ["run", "watch", cd: Path.expand("../", __DIR__)]]

# Watch static and templates for browser reloading.
config :remote_retro, RemoteRetroWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{lib/remote_retro_web/views/.*(ex)$},
      ~r{lib/remote_retro_web/templates/.*(eex)$},
    ],
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

config :honeybadger,
  environment_name: :dev

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :remote_retro, RemoteRetro.Repo,
  username: "postgres",
  password: "postgres",
  database: "remote_retro_dev",
  hostname: "localhost",
  pool_size: 10

config :remote_retro, RemoteRetro.Mailer, adapter: Bamboo.LocalAdapter

config :remote_retro, :oauth_client, OAuth2.Client

config :remote_retro, :mock_user, %{
  "given_name" => "Dev",
  "family_name" => "Tenderloin",
  "email" => "kris@thedevioustenderloin.io",
  "email_verified" => "true",
  "gender" => "male",
  "kind" => "plus#personOpenIdConnect",
  "locale" => "en",
  "name" => "Dev User",
  "picture" => "https://lh6.googleusercontent.com/-cZI40d8YpIQ/AAAAAAAAAAI/AAAAAAAAABs/gmDI7LQ2Lo0/photo.jpg?sz=50",
  "profile" => "https://plus.google.com/108658712426577966861",
  "sub" => "108658712426577966861",
}

config :tzdata, :autoupdate, :disabled
