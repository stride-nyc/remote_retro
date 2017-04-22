defmodule RemoteRetro.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :google_user_info, :jsonb
      add :family_name, :string
      add :given_name, :string
      add :locale, :string
      add :name, :string
      add :picture, :string
      add :profile, :string
      add :last_login, :datetime

      timestamps()
    end

    create unique_index(:users, [:email])
  end
end
