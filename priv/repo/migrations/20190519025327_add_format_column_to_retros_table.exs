defmodule RemoteRetro.Repo.Migrations.AddFormatColumnToRetrosTable do
  use Ecto.Migration
  alias RemoteRetro.RetroFormats

  def up do
    execute("create type retro_format as enum ('#{RetroFormats.happy_sad_confused}', '#{RetroFormats.start_stop_continue}')")

    alter table(:retros) do
      add :format, :string, default: RetroFormats.happy_sad_confused, null: false
    end
  end

  def down do
    alter table(:retros) do
      remove :format
    end

    execute("drop type retro_format")
  end
end
