defmodule RemoteRetro.Repo.Migrations.AddAuthorColumnToIdeas do
  use Ecto.Migration

  def change do
    alter table(:ideas) do
      add :author, :string
    end
  end
end
