defmodule RemoteRetro.IntegrationCase do

  use ExUnit.CaseTemplate

  using do
    quote do
      use Wallaby.DSL

      alias RemoteRetro.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      import RemoteRetro.Router.Helpers
      import RemoteRetro.TestHelpers
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(RemoteRetro.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(RemoteRetro.Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(RemoteRetro.Repo, self())
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    {:ok, session: session}
  end
end
