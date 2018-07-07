defmodule RemoteRetro.UserRetroCase do
  use ExUnit.CaseTemplate
  alias RemoteRetro.{Repo, User, Retro}

  @test_user_one Application.get_env(:remote_retro, :test_user_one)

  setup_all _tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)
    # we are setting :auto here so that the data persists for all tests,
    # normally (with :shared mode) every process runs in a transaction
    # and rolls back when it exits. setup_all runs in a distinct process
    # from each test so the data doesn't exist for each test.
    Ecto.Adapters.SQL.Sandbox.mode(Repo, :auto)
    {:ok, user} = User.upsert_record_from(oauth_info: @test_user_one)
    retro = Repo.insert!(%Retro{facilitator_id: user.id, stage: "idea-generation"})

    on_exit fn ->
      # this callback needs to checkout its own connection since it
      # runs in its own process
      :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)
      Ecto.Adapters.SQL.Sandbox.mode(Repo, :auto)

      Repo.delete(retro)
      Repo.delete(user)

      :ok
    end

    [user: user, retro: retro]
  end
end
