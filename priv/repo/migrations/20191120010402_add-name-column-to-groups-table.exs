defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-name-column-to-groups-table" do
  use Ecto.Migration

  def change do
    alter table(:groups) do
      add(:name, :string)
    end
  end
end
