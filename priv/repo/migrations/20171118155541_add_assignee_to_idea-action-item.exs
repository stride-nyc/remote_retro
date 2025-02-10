defmodule :"Elixir.RemoteRetro.Repo.Migrations.AddAssigneeToIdea-action-item" do
  use Ecto.Migration

  def change do
    alter table(:ideas) do
      add(
        :assignee_id,
        references(:users,
          column: :id,
          on_delete: :nothing
        )
      )
    end
  end
end
