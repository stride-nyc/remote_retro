use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :remote_retro, RemoteRetro.Endpoint,
  http: [port: 4001],
  server: true

config :remote_retro, :sql_sandbox, true

config :wallaby, screenshot_on_failure: true
config :wallaby, driver: Wallaby.Experimental.Chrome
config :bamboo, :refute_timeout, 10

# Print only warnings and errors during test
config :logger, level: :warn

config :remote_retro, RemoteRetro.Mailer, adapter: Bamboo.TestAdapter

# Configure your database
config :remote_retro, RemoteRetro.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "remote_retro_test",
  hostname: "localhost",
  ownership_timeout: 25_000,
  pool: Ecto.Adapters.SQL.Sandbox

config :remote_retro, :oauth_client, RemoteRetro.OAuth.Client.InMemory
config :remote_retro, :mock_user, %{
  "email" => "mistertestuser@gmail.com",
  "email_verified" => "true", "family_name" => "Vander Hoop",
  "gender" => "male", "given_name" => "Travis",
  "kind" => "plus#personOpenIdConnect", "locale" => "en",
  "name" => "Test User",
  "picture" => "https://lh6.googleusercontent.com/-cZI40d8YpIQ/AAAAAAAAAAI/AAAAAAAAABs/gmDI7LQ2Lo0/photo.jpg?sz=50",
  "profile" => "https://plus.google.com/108658712426577966861",
  "sub" => "108658712426577966861"
}
