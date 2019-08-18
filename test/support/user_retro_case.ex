defmodule RemoteRetro.UserRetroCase do
  use ExUnit.CaseTemplate
  alias RemoteRetro.{Repo, Retro, Participation, TestHelpers}
  import TestHelpers

  setup tags do
    _ = Ecto.Adapters.SQL.Sandbox.checkout(Repo)
    facilitator = persist_test_user()
    non_facilitator = persist_test_user()

    retro = Repo.insert!(%Retro{facilitator_id: facilitator.id, stage: "idea-generation"})

    Repo.insert!(%Participation{user_id: facilitator.id, retro_id: retro.id})
    Repo.insert!(%Participation{user_id: non_facilitator.id, retro_id: retro.id})

    tags = Map.merge(tags, %{facilitator: facilitator, retro: retro, non_facilitator: non_facilitator})

    {:ok, tags}
  end
end
