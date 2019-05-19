defmodule RemoteRetro.IdeaTest do
  use RemoteRetro.DataCase, async: true

  alias RemoteRetro.Idea

  @valid_idea %Idea{category: "sad", body: "Monday", retro_id: "derp", user_id: 1}

  test "body, category, user_id, and retro_id are required" do
    changeset = Idea.changeset(%Idea{category: nil})

    {body_error, _} = Keyword.fetch!(changeset.errors, :body)
    {category_error, _} = Keyword.fetch!(changeset.errors, :category)
    {retro_id_error, _} = Keyword.fetch!(changeset.errors, :retro_id)
    {user_id_error, _} = Keyword.fetch!(changeset.errors, :user_id)

    assert body_error == "can't be blank"
    assert category_error == "can't be blank"
    assert retro_id_error == "can't be blank"
    assert user_id_error == "can't be blank"
  end

  test "category can be happy" do
    changeset = Idea.changeset(@valid_idea, %{category: "happy"})
    errors_map = errors_on(changeset)
    refute Map.has_key?(errors_map, :category)
  end

  test "category can be sad" do
    changeset = Idea.changeset(@valid_idea, %{category: "sad"})
    errors_map = errors_on(changeset)
    refute Map.has_key?(errors_map, :category)
  end

  test "category can be confused" do
    changeset = Idea.changeset(@valid_idea, %{category: "confused"})
    errors_map = errors_on(changeset)
    refute Map.has_key?(errors_map, :category)
  end

  test "category can be action-item" do
    changeset = Idea.changeset(@valid_idea, %{category: "action-item"})
    errors_map = errors_on(changeset)
    refute Map.has_key?(errors_map, :category)
  end

  test "invalid idea categories are caught" do
    changeset = Idea.changeset(@valid_idea, %{category: "nonsensical seuss"})
    errors_map = errors_on(changeset)
    assert Map.has_key?(errors_map, :category)
  end

  describe "validating assignee_id presence" do
    test "assignee_id required when idea is action-item" do
      changeset = Idea.changeset(%Idea{category: "action-item", assignee_id: nil})

      {asignee_id_error, _} = Keyword.fetch!(changeset.errors, :assignee_id)

      assert asignee_id_error == "can't be blank"
    end

    test "assignee_id and category action-item do not trigger error" do
      changeset = Idea.changeset(%Idea{category: "action-item", assignee_id: 1})

      refute Keyword.has_key?(changeset.errors, :assignee_id)
    end

    test "assignee_id NOT required when idea category NOT action-item" do
      changeset = Idea.changeset(%Idea{category: "happy", assignee_id: nil})

      refute Keyword.has_key?(changeset.errors, :assignee_id)
    end
  end

  describe "JSON encoding of the model struct" do
    test "is enabled" do
      idea = %Idea{category: "sad", body: "flaky e2e test", id: 5}

      encoded = Jason.encode!(idea)

      assert encoded =~ ~r/"category":"sad"/i
      assert encoded =~ ~r/"body":"flaky e2e test"/i
      assert encoded =~ ~r/"id":5/i
    end
  end
end
