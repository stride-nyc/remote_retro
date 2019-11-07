defmodule :"Elixir.RemoteRetro.Repo.Migrations.Drop-unused-profile-column" do
  use Ecto.Migration

  def up do
    alter table(:users) do
      remove :profile
    end
  end

  def down do
    alter table(:users) do
      add :profile, :string
    end
  end
end
