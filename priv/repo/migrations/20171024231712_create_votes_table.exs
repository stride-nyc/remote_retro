defmodule RemoteRetro.Repo.Migrations.CreateVotesTable do
  use Ecto.Migration

  def change do
    create table(:votes) do
      add :user_id, references(:users, [
        column: :id,
        on_delete: :nothing
      ])

      add :idea_id, references(:ideas, [
        column: :id,
        on_delete: :nothing
      ])

      timestamps()
    end
  end
end
