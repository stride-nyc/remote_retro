defmodule RemoteRetro.Repo.Migrations.AddIndexToUserIdAndRetroId do
  use Ecto.Migration

  def change do
    create unique_index(:participations, [:user_id, :retro_id])
  end
end
