defmodule RemoteRetro.Repo.Migrations.AddVoteCountToParticipation do
  use Ecto.Migration

  def change do
    alter table(:participations) do
      add(:vote_count, :integer, default: 0, null: false)
    end
  end
end
