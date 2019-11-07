defmodule :"Elixir.RemoteRetro.Repo.Migrations.Allow-longer-email-fields-in-users-table" do

  use Ecto.Migration

  def up do
    alter table(:users) do
      modify :email, :string, size: 320
    end
  end

  def down do
    alter table(:users) do
      modify :email, :string
    end
  end
end
