defmodule RemoteRetro.Repo.Migrations.ChangeStageDefaultValue do
  use Ecto.Migration

  def change do
    alter table(:retros) do
      modify :stage, :string, default: "prime-directive"
    end
  end
end
