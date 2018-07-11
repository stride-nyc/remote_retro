defmodule RemoteRetro.IntegrationCase do

  use ExUnit.CaseTemplate
  use Wallaby.DSL

  alias RemoteRetro.{Repo, Retro, User, TestHelpers}

  import TestHelpers

  @test_user_one Application.get_env(:remote_retro, :test_user_one)

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

      import RemoteRetroWeb.Router.Helpers
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
    stage = tags[:retro_stage] || "idea-generation"

    {:ok, user} = User.upsert_record_from(oauth_info: @test_user_one)
    {:ok, retro} = Repo.insert(%Retro{stage: stage, facilitator_id: user.id})

    session = TestHelpers.new_authenticated_browser_session(metadata)

    {:ok, session: session, retro: retro, user: user}
  end
end
