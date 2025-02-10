defmodule :"Elixir.RemoteRetro.Repo.Migrations.Remove-not-null-constraint-from-users-family-name" do
  use Ecto.Migration

  def up do
    alter table(:users) do
      modify(:family_name, :string, null: true)
    end
  end

  def down do
    alter table(:users) do
      modify(:family_name, :string, null: false)
    end
  end
end
