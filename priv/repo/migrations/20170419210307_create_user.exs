defmodule RemoteRetro.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :google_user_info, :jsonb, null: false
      add :family_name, :string, null: false
      add :given_name, :string, null: false
      add :locale, :string, null: false
      add :name, :string, null: false
      add :picture, :string, null: false
      add :last_login, :naive_datetime, null: false
      add :profile, :string

      timestamps()
    end

    create unique_index(:users, [:email])
  end
end
