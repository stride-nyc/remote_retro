defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-retros-table" do
  use Ecto.Migration

  def change do
    create table(:retros, primary_key: false) do
      add :id, :uuid, primary_key: true

      timestamps
    end
  end
end
