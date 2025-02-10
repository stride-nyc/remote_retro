defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-not-null-constraints-to-votes" do
  use Ecto.Migration

  def up do
    drop_if_exists(index(:votes, [:user_id]))
    drop_if_exists(index(:votes, [:idea_id]))

    drop(constraint(:votes, "votes_user_id_fkey"))
    drop(constraint(:votes, "votes_idea_id_fkey"))

    alter table(:votes) do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :delete_all
        ),
        null: false
      )

      modify(
        :idea_id,
        references(:ideas,
          column: :id,
          on_delete: :delete_all
        ),
        null: false
      )
    end

    create_if_not_exists(index(:votes, [:user_id]))
    create_if_not_exists(index(:votes, [:idea_id]))
  end

  def down do
    drop_if_exists(index(:votes, [:user_id]))
    drop_if_exists(index(:votes, [:idea_id]))

    drop(constraint(:votes, "votes_user_id_fkey"))
    drop(constraint(:votes, "votes_idea_id_fkey"))

    alter table(:votes) do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :delete_all
        ),
        null: true
      )

      modify(
        :idea_id,
        references(:ideas,
          column: :id,
          on_delete: :delete_all
        ),
        null: true
      )
    end

    create_if_not_exists(index(:votes, [:user_id]))
    create_if_not_exists(index(:votes, [:idea_id]))
  end
end
