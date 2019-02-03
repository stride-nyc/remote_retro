defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-completed-retros-count" do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :completed_retros_count, :integer, default: 0, null: false
    end
  end
end
