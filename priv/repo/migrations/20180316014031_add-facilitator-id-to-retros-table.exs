defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-facilitator-id-to-retros-table" do
  use Ecto.Migration

  def change do
    alter table(:retros) do
      add(
        :facilitator_id,
        references(:users,
          column: :id,
          on_delete: :nothing
        )
      )
    end
  end
end
