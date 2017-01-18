ExUnit.start

# Create the database, run migrations, and start the test transaction.
Ecto.Adapters.SQL.Sandbox.mode(RemoteRetro.Repo, :manual)

{:ok, _} = Application.ensure_all_started(:wallaby)
