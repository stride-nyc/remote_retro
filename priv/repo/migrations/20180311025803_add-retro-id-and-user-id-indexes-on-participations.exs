defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-retro-id-and-user-id-indexes-on-participations" do
  use Ecto.Migration

  def change do
    create(index(:participations, [:retro_id]))
    create(index(:participations, [:user_id]))
  end
end
