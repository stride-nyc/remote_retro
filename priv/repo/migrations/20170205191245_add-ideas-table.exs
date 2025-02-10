defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-ideas-table" do
  use Ecto.Migration

  def change do
    create table(:ideas) do
      add(:category, :string, null: false)
      add(:body, :string, null: false)

      add(
        :retro_id,
        references(:retros,
          column: :id,
          type: :uuid,
          on_delete: :delete_all
        )
      )

      timestamps()
    end
  end
end
