defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-on-delete-cascade-for-ideas-user-id" do
  use Ecto.Migration

  def up do
    drop(constraint(:ideas, "ideas_user_id_fkey"))

    alter table("ideas") do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :delete_all
        )
      )
    end
  end

  def down do
    drop(constraint(:ideas, "ideas_user_id_fkey"))

    alter table("ideas") do
      modify(
        :user_id,
        references(:users,
          column: :id,
          on_delete: :nothing
        )
      )
    end
  end
end
