defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-default-value-to-groups-name" do
  use Ecto.Migration

  def up do
    execute("UPDATE groups SET name = '' WHERE name IS NULL")

    alter table(:groups) do
      modify(:name, :string, default: "", null: false)
    end
  end

  def down do
    alter table(:groups) do
      modify(:name, :string, default: nil, null: true)
    end

    execute("UPDATE groups SET name = NULL WHERE name = ''")
  end
end
