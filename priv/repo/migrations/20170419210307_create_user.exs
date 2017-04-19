defmodule RemoteRetro.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :google_user_info, :jsonb
      add :email, :string
      add :last_login, :datetime

      timestamps()
    end
    create unique_index(:users, [:email])

  end
end
