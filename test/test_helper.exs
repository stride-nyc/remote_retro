ExUnit.start(exclude: [:skip])

# Mock Honeybadger to prevent errors in tests
defmodule Honeybadger do
  def notify(_exception, _opts \\ []), do: :ok
end

# Create the database, run migrations, and start the test transaction.
Ecto.Adapters.SQL.Sandbox.mode(RemoteRetro.Repo, :manual)
