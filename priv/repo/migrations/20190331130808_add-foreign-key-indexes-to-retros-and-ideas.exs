defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-foreign-key-indexes-to-retros-and-ideas" do
  use Ecto.Migration

  def change do
    create index(:retros, [:facilitator_id])
    create index(:ideas, [:user_id])
  end
end
