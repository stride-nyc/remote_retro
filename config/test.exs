import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :remote_retro, RemoteRetroWeb.Endpoint,
  http: [port: 4001],
  server: true

config :remote_retro, :sql_sandbox, true

config :wallaby, screenshot_on_failure: true
config :bamboo, :refute_timeout, 10

{:ok, file} = File.open("browser_logs.log", [:write])
Application.put_env(:wallaby, :js_logger, file)

# Print only warnings and errors during test
config :logger, level: :warning

# allow test users to authenticate
config :remote_retro, :auth_controller, RemoteRetroWeb.MockAuthController

config :honeybadger,
  environment_name: :test,
  exclude_envs: [:test],
  api_key: nil,
  disabled: true

config :remote_retro, RemoteRetro.Mailer, adapter: Bamboo.TestAdapter
config :remote_retro, plug_init_mode: :runtime

# Configure your database
config :remote_retro, RemoteRetro.Repo,
  username: "postgres",
  password: "postgres",
  database: "remote_retro_test",
  hostname: "localhost",
  ownership_timeout: 60_000,
  pool: Ecto.Adapters.SQL.Sandbox

config :remote_retro, :oauth_client, RemoteRetro.OAuth.Client.InMemory
config :remote_retro, :allow_user_masquerade, true

config :remote_retro, :mock_google_user_info, %{
  "email" => "mrtestuser@one.com",
  "email_verified" => "true",
  "family_name" => "User",
  "gender" => "male",
  "given_name" => "Test",
  "kind" => "plus#personOpenIdConnect",
  "locale" => "en",
  "name" => "Test User",
  "picture" => "https://lh3.googleusercontent.com/a-/AAuE7mBrZMjcPzGHlf3FroPgxpVoVxt33dY3L8l8o4ncoj1GgIDVGMvtPn8Zvz26oo0CFAbmI5gPSEJzJrK9Nxma-6_Qhop6u-1JK8_-K3LLtLj1ZDic6xx9YeGUDsHEF3VrjqzSvoQWkIsEHVsUnTOogh4EuVUMSB-8ftR-bjfZROHxy4Py_4WAn773RKF9ZTbpb7ajTHkBwS7o5GF3riAPEJ9f3XUD9dASlSpRjYq7_hWzXPSAQ3on-A16bKUtily8RprssgIAc63D21XxYqkulhXhUDgDjVMVhhXmgCj1rwzBV_jd8CCJlQx7dJ4Tn5gl2Ur00TFmrKIx0-1FDE8Kiiu6wRmf7rXEFN450zW0PqRjkttiYQj3HdbiPfFOVqvlKcp_4I9o9NwqbdQWhyO_cvAhCAa9B8s8vSc5Dtg5qfA389KnRJu9hPYPhYsUc1bFSLebKG-VKUPhyzMue8Q5pTWeystzI6Zs_ALxpbobS7wPRBE_s48pV5vFWbumWTeRxc00rvINs88unMwsMS8Vet4LfvEdIm00mp5aePI73hLQXVzKI0o4XTMmKKGOM2WhZxag3WVvjMZAfGExvScPNerOyK3pCNK4RLI2DQMfvSIJENlX155kmqYafB7-bJ_pzlDdbZaKA6ShGam9UMuKnIeAHBbKW3c-9blUIu4d92fOMfLWFASzz3YSC9p5OUCe_3wexVQ9NSMhwWNr0LDQ04gxt2X3AOoaLyYH_t8H1mnBW0z0jRC0FxmK5-r-xLY",
  "profile" => "https://plus.google.com/108658712426577966861",
  "sub" => "108658712426577966861",
}
