defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-x-and-y-coordinates-to-ideas-table" do
  use Ecto.Migration

  def change do
    alter table(:ideas) do
      add :x, :float, default: nil
      add :y, :float, default: nil
    end
  end
end
