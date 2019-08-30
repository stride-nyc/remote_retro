defmodule :"Elixir.RemoteRetro.Repo.Migrations.Add-index-to-ideas-assigneeId" do
  use Ecto.Migration

  def change do
    create index(:ideas, [:assignee_id])
  end
end
