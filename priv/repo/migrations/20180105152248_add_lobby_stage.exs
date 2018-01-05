defmodule RemoteRetro.Repo.Migrations.AddLobbyStage do
  use Ecto.Migration

  def up do
    alter table(:retros) do
      modify :stage, :string, default: "lobby"
    end
  end

  def down do
    alter table(:retros) do
      modify :stage, :string, default: "prime-directive"
    end
  end
end
