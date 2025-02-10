defmodule RemoteRetro.Repo.Migrations.AddVotesToIdeas do
  use Ecto.Migration

  def change do
    alter table(:ideas) do
      add(:vote_count, :integer)
    end
  end
end
