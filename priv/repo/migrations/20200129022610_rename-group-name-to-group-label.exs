defmodule :"Elixir.RemoteRetro.Repo.Migrations.Rename-group-name-to-group-label" do
  use Ecto.Migration

  def up do
    rename table("groups"), :name, to: :label
  end

  def down do
    rename table("groups"), :label, to: :name
  end
end
