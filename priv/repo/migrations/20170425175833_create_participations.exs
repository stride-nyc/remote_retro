defmodule RemoteRetro.Repo.Migrations.CreateParticipations do
  use Ecto.Migration

  def change do
    create table(:participations) do
      add :user_id, references(:users, [
        column: :id,
        on_delete: :nothing
      ])
      add :retro_id, references(:retros, [
        column: :id,
        type: :uuid,
        on_delete: :nothing
      ])

      timestamps()
    end
  end
end
