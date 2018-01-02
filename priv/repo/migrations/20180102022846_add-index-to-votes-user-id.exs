defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-index-to-votes-user-id" do
  use Ecto.Migration

  def change do
    create index(:votes, [:user_id])
    create index(:votes, [:idea_id])
  end
end
