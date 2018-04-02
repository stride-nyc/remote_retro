defmodule RemoteRetroWeb.IdeaView do
  def action_item_to_string(action_item) do
    case action_item.assignee do
      nil -> action_item.body
      _user -> "#{action_item.body} (#{action_item.assignee.name})"
    end
  end
end
