defmodule RemoteRetro.Repo.Migrations.RemoveAuthorFromIdea do
  use Ecto.Migration

  def change do
    alter table(:ideas) do
      remove(:author)
    end
  end
end
