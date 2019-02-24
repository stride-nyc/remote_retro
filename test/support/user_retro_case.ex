defmodule RemoteRetro.UserRetroCase do
  use ExUnit.CaseTemplate
  alias RemoteRetro.{Repo, Retro, User, Participation, TestHelpers}
  import Ecto.Query, only: [from: 2]
  import TestHelpers

  setup_all _tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)
    # we are setting :auto here so that the data persists for all tests,
    # normally (with :shared mode) every process runs in a transaction
    # and rolls back when it exits. setup_all runs in a distinct process
    # from each test so the data doesn't exist for each test.
    Ecto.Adapters.SQL.Sandbox.mode(Repo, :auto)

    facilitator = persist_test_user()
    non_facilitator = persist_test_user()

    retro = Repo.insert!(%Retro{facilitator_id: facilitator.id, stage: "idea-generation"})

    Repo.insert!(%Participation{user_id: facilitator.id, retro_id: retro.id})
    Repo.insert!(%Participation{user_id: non_facilitator.id, retro_id: retro.id})

    on_exit fn ->
      # this callback needs to checkout its own connection since it
      # runs in its own process
      :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)

      # participations are deleted via cascade on deletion of retro
      retro = Repo.get!(Retro, retro.id)
      Repo.delete(retro)

      user_ids = [facilitator.id, non_facilitator.id]
      from(u in User, where: u.id in ^user_ids) |> Repo.delete_all


      :ok
    end

    [facilitator: facilitator, retro: retro, non_facilitator: non_facilitator]
  end
end
