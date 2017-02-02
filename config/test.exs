use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :remote_retro, RemoteRetro.Endpoint,
  http: [port: 4001],
  server: true

config :remote_retro, :sql_sandbox, true

config :wallaby,
  screenshot_on_failure: true,
  phantomjs: "node_modules/phantomjs/bin/phantomjs"

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :remote_retro, RemoteRetro.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "remote_retro_test",
  hostname: "localhost",
  ownership_timeout: 25_000,
  pool: Ecto.Adapters.SQL.Sandbox
