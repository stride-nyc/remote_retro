use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :remote_retro, RemoteRetroWeb.Endpoint,
  http: [port: 4001],
  server: true

config :remote_retro, :sql_sandbox, true

config :wallaby, screenshot_on_failure: true
config :wallaby, driver: Wallaby.Experimental.Chrome
config :bamboo, :refute_timeout, 10

{:ok, file} = File.open("browser_logs.log", [:write])
Application.put_env(:wallaby, :js_logger, file)

# Print only warnings and errors during test
config :logger, level: :warn

config :honeybadger,
  environment_name: :test

config :remote_retro, RemoteRetro.Mailer, adapter: Bamboo.TestAdapter

# Configure your database
config :remote_retro, RemoteRetro.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "remote_retro_test",
  hostname: "localhost",
  ownership_timeout: 60_000,
  pool: Ecto.Adapters.SQL.Sandbox

config :remote_retro, :oauth_client, RemoteRetro.OAuth.Client.InMemory
config :remote_retro, :test_user_one, %{
  "email" => "mrtestuser@one.com",
  "email_verified" => "true", "family_name" => "User",
  "gender" => "male", "given_name" => "Test",
  "kind" => "plus#personOpenIdConnect", "locale" => "en",
  "name" => "Test User",
  "picture" => "/images/test_user.png",
  "profile" => "https://plus.google.com/108658712426577966861",
  "sub" => "108658712426577966861"
}

config :remote_retro, :test_user_two, %{
  "email" => "missotheruser@two.com",
  "email_verified" => "true", "family_name" => "User",
  "gender" => "female", "given_name" => "Other",
  "kind" => "plus#personOpenIdConnect", "locale" => "en",
  "name" => "Other User",
  "picture" => "/images/test_user.png",
  "profile" => "https://plus.google.com/u/1/+NicholAlexander",
  "sub" => "106702782098698370243"
}
