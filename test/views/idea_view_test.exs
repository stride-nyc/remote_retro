defmodule RemoteRetro.IdeaViewTest do
  use RemoteRetroWeb.ConnCase, async: true
  alias RemoteRetro.{Idea, User}
  alias RemoteRetroWeb.IdeaView

  describe ".action_item_to_string" do
    test "returns the action item's body, and assignee's name as a parenthetical" do
      assignee = %User{name: "Taryn Vander Hoop"}
      action_item = %Idea{category: "action-item", body: "Buy shampoo", assignee: assignee}

      assert IdeaView.action_item_to_string(action_item) == "Buy shampoo (Taryn Vander Hoop)"
    end

    test "returns the action item's body when the item lacks an assignee" do
      action_item = %Idea{category: "action-item", body: "Take shower", assignee: nil}

      assert IdeaView.action_item_to_string(action_item) == "Take shower"
    end
  end
end
