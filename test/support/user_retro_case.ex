defmodule RemoteRetro.UserRetroCase do
  use ExUnit.CaseTemplate
  alias RemoteRetro.{Repo, User, Retro, Participation}

  @test_user_one Application.get_env(:remote_retro, :test_user_one)
  @test_user_two Application.get_env(:remote_retro, :test_user_two)

  setup_all _tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)
    # we are setting :auto here so that the data persists for all tests,
    # normally (with :shared mode) every process runs in a transaction
    # and rolls back when it exits. setup_all runs in a distinct process
    # from each test so the data doesn't exist for each test.
    Ecto.Adapters.SQL.Sandbox.mode(Repo, :auto)

    {:ok, facilitator} = User.upsert_record_from(oauth_info: @test_user_one)
    {:ok, non_facilitator} = User.upsert_record_from(oauth_info: @test_user_two)
    retro = Repo.insert!(%Retro{facilitator_id: facilitator.id, stage: "idea-generation"})
    participation = Repo.insert!(%Participation{user_id: facilitator.id, retro_id: retro.id})
    participation_two = Repo.insert!(%Participation{user_id: non_facilitator.id, retro_id: retro.id})

    on_exit fn ->
      # this callback needs to checkout its own connection since it
      # runs in its own process
      :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)
      Ecto.Adapters.SQL.Sandbox.mode(Repo, :auto)

      Repo.delete(participation)
      Repo.delete(participation_two)
      Repo.delete(retro)
      Repo.delete(facilitator)
      Repo.delete(non_facilitator)

      :ok
    end

    [facilitator: facilitator, retro: retro, non_facilitator: non_facilitator]
  end
end
