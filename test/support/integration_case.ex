defmodule RemoteRetro.IntegrationCase do
  use ExUnit.CaseTemplate
  use Wallaby.DSL

  alias RemoteRetro.{Repo, Retro, TestHelpers}

  import TestHelpers

  setup_all context do
    # Ensure all applications are started
    {:ok, _} = Application.ensure_all_started(:wallaby)
    {:ok, _} = Application.ensure_all_started(:remote_retro)
    
    # Configure Wallaby base URL
    Application.put_env(:wallaby, :base_url, "http://localhost:4001")
    
    # Give Selenium and Phoenix server time to be ready
    :timer.sleep(5000)
    
    # Ensure Phoenix server is running
    case HTTPoison.get("http://localhost:4001") do
      {:error, %HTTPoison.Error{reason: :econnrefused}} ->
        # Start Phoenix server if not running
        Application.ensure_all_started(:phoenix)
        Application.ensure_all_started(:remote_retro)
        :timer.sleep(1000)  # Give server time to start
      _ -> :ok
    end
    
    on_exit fn ->
      # Clean up resources
      Application.stop(:wallaby)
      Application.stop(:remote_retro)
    end
    
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
