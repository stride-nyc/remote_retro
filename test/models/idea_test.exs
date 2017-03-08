defmodule RemoteRetro.IdeaTest do
  use RemoteRetro.ModelCase, async: true

  alias RemoteRetro.Idea

  test "body, category, and retro id are required" do
    changeset = Idea.changeset(%Idea{})

    { body_error, _ } = Keyword.fetch!(changeset.errors, :body)
    { category_error, _ } = Keyword.fetch!(changeset.errors, :category)
    { retro_id_error, _ } = Keyword.fetch!(changeset.errors, :retro_id)

    assert body_error == "can't be blank"
    assert category_error == "can't be blank"
    assert retro_id_error == "can't be blank"
  end

  describe "JSON encoding" do
    test "includes body, category, and id attributes" do
      idea = %Idea{category: "sad", body: "flaky e2e test", id: 5}

      encoded = Poison.encode!(idea)

      assert encoded =~ ~r/"category":"sad"/i
      assert encoded =~ ~r/"body":"flaky e2e test"/i
      assert encoded =~ ~r/"id":5/i
    end
  end

end
