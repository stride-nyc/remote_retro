defmodule RemoteRetro.IdeaTest do
  use RemoteRetro.ModelCase

  alias RemoteRetro.Idea

  test "body,   category, and retro id are required" do
    changeset = Idea.changeset(%Idea{})

    { body_error, _ } = Keyword.fetch!(changeset.errors, :body)
    { category_error, _ } = Keyword.fetch!(changeset.errors, :category)
    { retro_id_error, _ } = Keyword.fetch!(changeset.errors, :retro_id)

    assert body_error == "can't be blank"
    assert category_error == "can't be blank"
    assert retro_id_error == "can't be blank"
  end

end
