defmodule RemoteRetro.IntegrationCase do

  use ExUnit.CaseTemplate
  alias RemoteRetro.Repo
  alias RemoteRetro.Retro
  use Wallaby.DSL

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
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(Repo, {:shared, self()})
    end

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(Repo, self())
    {:ok, retro} = Repo.insert(%Retro{})

    {:ok, session} = Wallaby.start_session(metadata: metadata)

    session = set_window_size(session, 1000, 1000)

    {:ok, session: session, retro: retro}
  end
end
