defmodule RemoteRetro.Repo.Migrations.DropVoteCountFromIdeasAndParticipations do
  use Ecto.Migration

  def up do
    alter table(:ideas) do
      remove :vote_count
    end

    alter table(:participations) do
      remove :vote_count
    end
  end

  def down do
    alter table(:ideas) do
      add :vote_count, :integer
    end

    alter table(:participations) do
      add :vote_count, :integer, default: 0, null: false
    end
  end
end
