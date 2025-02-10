defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-foreign-key-on-delete-commands" do
  use Ecto.Migration

  def up do
    drop(constraint(:retros, "retros_facilitator_id_fkey"))

    alter table("retros") do
      modify(
        :facilitator_id,
        references(:users,
          column: :id,
          on_delete: :nilify_all
        )
      )
    end

    drop(constraint(:ideas, "ideas_assignee_id_fkey"))

    alter table("ideas") do
      modify(
        :assignee_id,
        references(:users,
          column: :id,
          on_delete: :nilify_all
        )
      )
    end

    drop(constraint(:participations, "participations_user_id_fkey"))

    alter table("participations") do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :delete_all
        )
      )
    end

    drop(constraint(:participations, "participations_retro_id_fkey"))

    alter table("participations") do
      modify(
        :retro_id,
        references(:retros,
          column: :id,
          type: :uuid,
          on_delete: :delete_all
        )
      )
    end

    drop(constraint(:votes, "votes_user_id_fkey"))

    alter table("votes") do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :delete_all
        )
      )
    end

    drop(constraint(:votes, "votes_idea_id_fkey"))

    alter table("votes") do
      modify(
        :idea_id,
        references(:ideas,
          column: :id,
          on_delete: :delete_all
        )
      )
    end
  end

  def down do
    drop(constraint(:retros, "retros_facilitator_id_fkey"))

    alter table("retros") do
      modify(
        :facilitator_id,
        references(:users,
          column: :id,
          on_delete: :nothing
        )
      )
    end

    drop(constraint(:ideas, "ideas_assignee_id_fkey"))

    alter table("ideas") do
      modify(
        :assignee_id,
        references(:users,
          column: :id,
          on_delete: :nothing
        )
      )
    end

    drop(constraint(:participations, "participations_user_id_fkey"))

    alter table("participations") do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :nothing
        )
      )
    end

    drop(constraint(:participations, "participations_retro_id_fkey"))

    alter table("participations") do
      modify(
        :retro_id,
        references(:retros,
          column: :id,
          type: :uuid,
          on_delete: :nothing
        )
      )
    end

    drop(constraint(:votes, "votes_user_id_fkey"))

    alter table("votes") do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :nothing
        )
      )
    end

    drop(constraint(:votes, "votes_idea_id_fkey"))

    alter table("votes") do
      modify(
        :idea_id,
        references(:ideas,
          column: :id,
          on_delete: :nothing
        )
      )
    end
  end
end
