defmodule RemoteRetro.Repo.Migrations.RemoveUnusedIndexes do
  use Ecto.Migration

  def change do
    drop(index(:ideas, [:group_id]))
    drop(index(:ideas, [:user_id]))
    drop(index(:ideas, [:assignee_id]))
    drop(index(:retros, [:facilitator_id]))
  end
end
