defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-not-null-constraint-to-retros-stage" do
  use Ecto.Migration

  def up do
    alter table(:retros) do
      modify :stage, :string, default: "lobby", null: false
    end
  end

  def down do
    alter table(:retros) do
      modify :stage, :string, default: "lobby", null: true
    end
  end
end
