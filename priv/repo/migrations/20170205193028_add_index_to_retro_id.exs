defmodule RemoteRetro.Repo.Migrations.AddIndexToRetroId do
  use Ecto.Migration

  def change do
    create(index(:ideas, [:retro_id]))
  end
end
