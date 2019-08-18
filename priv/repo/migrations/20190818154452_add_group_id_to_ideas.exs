defmodule RemoteRetro.Repo.Migrations.AddGroupIdToIdeas do
  use Ecto.Migration

  def change do
    alter table(:ideas) do
      add :group_id, references("groups")
    end

    create index(:ideas, [:group_id])
  end
end
