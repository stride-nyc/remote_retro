defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-not-null-constraints-to-participations" do
  use Ecto.Migration

  def up do
    drop_if_exists(unique_index(:participations, [:user_id, :retro_id]))
    drop_if_exists(index(:participations, [:user_id]))
    drop_if_exists(index(:participations, [:retro_id]))

    drop(constraint(:participations, "participations_user_id_fkey"))
    drop(constraint(:participations, "participations_retro_id_fkey"))

    alter table(:participations) do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :delete_all
        ),
        null: false
      )

      modify(
        :retro_id,
        references(:retros,
          column: :id,
          type: :uuid,
          on_delete: :delete_all
        ),
        null: false
      )
    end

    create_if_not_exists(index(:participations, [:user_id]))
    create_if_not_exists(index(:participations, [:retro_id]))
    create_if_not_exists(unique_index(:participations, [:user_id, :retro_id]))
  end

  def down do
    drop_if_exists(unique_index(:participations, [:user_id, :retro_id]))
    drop_if_exists(index(:participations, [:user_id]))
    drop_if_exists(index(:participations, [:retro_id]))

    drop(constraint(:participations, "participations_user_id_fkey"))
    drop(constraint(:participations, "participations_retro_id_fkey"))

    alter table(:participations) do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :delete_all
        ),
        null: true
      )

      modify(
        :retro_id,
        references(:retros,
          column: :id,
          type: :uuid,
          on_delete: :delete_all
        ),
        null: true
      )
    end

    create_if_not_exists(index(:participations, [:user_id]))
    create_if_not_exists(index(:participations, [:retro_id]))
    create_if_not_exists(unique_index(:participations, [:user_id, :retro_id]))
  end
end
