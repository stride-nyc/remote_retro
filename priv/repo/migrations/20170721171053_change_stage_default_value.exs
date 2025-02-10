defmodule RemoteRetro.Repo.Migrations.ChangeStageDefaultValue do
  use Ecto.Migration

  def up do
    alter table(:retros) do
      modify(:stage, :string, default: "prime-directive")
    end
  end

  def down do
    alter table(:retros) do
      modify(:stage, :string, default: "idea-generation")
    end
  end
end
