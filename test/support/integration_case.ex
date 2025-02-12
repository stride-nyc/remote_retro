defmodule RemoteRetro.IntegrationCase do
  use ExUnit.CaseTemplate
  use Wallaby.DSL

  alias RemoteRetro.{Repo, Retro, TestHelpers}

  import TestHelpers

#  setup_all _context do
#    # Start applications in correct order
#    {:ok, _} = Application.ensure_all_started(:phoenix)
#   {:ok, _} = Application.ensure_all_started(:wallaby)
#    {:ok, _} = Application.ensure_all_started(:remote_retro)
#    
#    # Configure Wallaby
#    Application.put_env(:wallaby, :base_url, "http://localhost:4001")
#    Application.put_env(:wallaby, :selenium, [
#      capabilities: %{
#        browserName: "firefox",
#        "moz:firefoxOptions": %{
#          args: ["-headless"],
#          log: %{level: "trace"}
#        }
#      },
#      port: 4444,
#      path_prefix: "wd/hub"
#    ])
#
#    # Verify Selenium is running
#    case HTTPoison.get("http://localhost:4444/wd/hub/status") do
#      {:ok, response} ->
#        IO.puts "Selenium status: #{response.body}"
#      {:error, error} ->
#        IO.puts "Error checking Selenium status: #{inspect(error)}"
#        exit(:selenium_not_ready)
#    end
#
#    on_exit(fn -> 
#      # Cleanup applications in reverse order
#      :ok = Application.stop(:remote_retro)
#      :ok = Application.stop(:wallaby)
#      :ok = Application.stop(:phoenix)
#    end)
#
#    :ok
#  end

  setup_all context do
    {:ok, _} = Application.ensure_all_started(:wallaby)
    :timer.sleep(50)
    Application.put_env(:wallaby, :base_url, "http://localhost:4001")
    context
  end

  using do
    quote do
      use Wallaby.DSL

      alias RemoteRetro.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      alias RemoteRetroWeb.Router.Helpers, as: Routes
      import RemoteRetro.TestHelpers
      @moduletag :feature_test
    end
  end

  using do
    quote do
      use Wallaby.DSL

      alias RemoteRetro.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      alias RemoteRetroWeb.Router.Helpers, as: Routes
      import RemoteRetro.TestHelpers
      @moduletag :feature_test
    end
  end

  setup context do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)

    unless context[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Repo, self())

    facilitator = persist_test_user()
    non_facilitator = persist_test_user(%{"name" => "Monsieur User"})

    retro =
      Repo.insert!(%Retro{
        stage: context[:retro_stage] || "idea-generation",
        facilitator_id: facilitator.id,
      })

    session = new_authenticated_browser_session(facilitator, metadata)

    {:ok, session: session, retro: retro, facilitator: facilitator, non_facilitator: non_facilitator}
  end
end
