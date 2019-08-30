defmodule :"Elixir.RemoteRetro.Repo.Migrations.Shift-ideas-category-column-to-enum" do
  use Ecto.Migration

  def up do
    execute("DELETE FROM ideas WHERE category = 'yaboy'")
    execute("create type idea_category as enum ('happy', 'sad', 'confused', 'action-item', 'start', 'stop', 'continue')")
    execute("alter table ideas alter column category type idea_category using (category::idea_category)")
  end

  def down do
    alter table(:ideas) do
      modify :category, :string, null: false
    end

    execute("drop type idea_category")
  end
end
