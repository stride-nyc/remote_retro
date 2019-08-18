defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-groups-table" do
  use Ecto.Migration

  def change do
    create table(:groups) do
      timestamps()
    end
  end
end
