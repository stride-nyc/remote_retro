defmodule :"Elixir.RemoteRetro.Repo.Migrations.Alter-users-url-fields-from-varchar-to-text" do
  use Ecto.Migration

  def up do
    alter table(:users) do
      modify(:picture, :text)
    end
  end

  def down do
    alter table(:users) do
      modify(:picture, :string)
    end
  end
end
