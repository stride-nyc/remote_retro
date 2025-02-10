defmodule RemoteRetro.Repo.Migrations.AddStageColumnToRetros do
  use Ecto.Migration

  def change do
    alter table(:retros) do
      add(:stage, :string, default: "idea-generation")
    end
  end
end
