# Start Phoenix endpoint and all required applications
{:ok, _} = Application.ensure_all_started(:remote_retro)
{:ok, _} = Application.ensure_all_started(:wallaby)

ExUnit.start(exclude: [:skip])

# Mock Honeybadger to prevent errors in tests
defmodule Honeybadger do
  def notify(_exception, _opts \\ []), do: :ok
end

# Create the database, run migrations, and start the test transaction.
Ecto.Adapters.SQL.Sandbox.mode(RemoteRetro.Repo, :manual)

# Configure Wallaby for local development
Application.put_env(:wallaby, :max_wait_time, 30_000)
Application.put_env(:wallaby, :hackney_options, [timeout: 30_000, recv_timeout: 30_000])
Application.put_env(:wallaby, :selenium, [
  capabilities: %{
    browserName: "firefox",
    "moz:firefoxOptions": %{
      args: ["-headless"]
    }
  },
  pool_timeout: 30_000
])
