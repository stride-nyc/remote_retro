defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-not-null-constraint-to-ideas-retroId" do
  use Ecto.Migration

  def up do
    drop constraint(:ideas, "ideas_retro_id_fkey")

    alter table(:ideas) do
      modify(:retro_id, references(:retros, [
        column: :id,
        type: :uuid,
        on_delete: :delete_all,
      ]), null: false)
    end
  end

  def down do
    drop constraint(:ideas, "ideas_retro_id_fkey")

    alter table(:ideas) do
      modify(:retro_id, references(:retros, [
        column: :id,
        type: :uuid,
        on_delete: :delete_all,
      ]), null: true)
    end
  end
end
