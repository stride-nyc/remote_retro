defmodule RemoteRetro.Repo.Migrations.AddUserIdToIdea do
  use Ecto.Migration

  def change do
    alter table(:ideas) do
      add(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :nothing
        )
      )
    end
  end
end
