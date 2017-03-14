defmodule RemoteRetro.IntegrationCase do

  use ExUnit.CaseTemplate
  alias RemoteRetro.Repo
  alias RemoteRetro.Retro
  import RemoteRetro.TestHelpers

  use Wallaby.DSL

  setup_all context do
    {:ok, _} = Application.ensure_all_started(:wallaby)
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

      import RemoteRetro.Router.Helpers
      import RemoteRetro.TestHelpers
      @moduletag :feature_test
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Repo, self())
    {:ok, retro} = Repo.insert(%Retro{})

    {:ok, session} = Wallaby.start_session(metadata: metadata)

    session = resize_window(session, 1000, 1000)

    session = authenticate(session)
    {:ok, session: session, retro: retro}
  end
end
