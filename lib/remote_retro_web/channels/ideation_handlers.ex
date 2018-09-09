defmodule RemoteRetroWeb.IdeationHandlers do
  import Phoenix.Channel
  import ShorterMaps

  use SlenderChannel

  alias RemoteRetro.{Repo, Idea}

  def handle_in("idea_submitted", idea_params, socket) do
    {reply_atom, _} = atomic_insert_and_broadcast(idea_params, socket)

    {:reply, reply_atom, socket}
  end

  def handle_in("idea_edited", ~m{id, body, category, assigneeId}, socket) do
    idea =
      Repo.get(Idea, id)
      |> Idea.changeset(~M{body, category, assignee_id: assigneeId})
      |> Repo.update!

    broadcast! socket, "idea_edited", idea
    {:reply, :ok, socket}
  end

  def handle_in("idea_deleted", id, socket) do
    idea = Repo.delete!(%Idea{id: id})

    broadcast! socket, "idea_deleted", idea
    {:noreply, socket}
  end

  handle_in_and_broadcast("idea_highlight_toggled", ~m{id, isHighlighted})
  handle_in_and_broadcast("idea_live_edit", ~m{id, liveEditText})
  handle_in_and_broadcast("idea_typing_event", ~m{userToken})
  handle_in_and_broadcast("idea_edit_state_enabled", ~m{id, editorToken})
  handle_in_and_broadcast("idea_edit_state_disabled", ~m{id})

  defp atomic_insert_and_broadcast(idea_params, socket) do
    Repo.transaction(fn ->
      idea = insert_idea!(idea_params, socket)
      broadcast! socket, "idea_committed", idea
    end)
  rescue
    _ -> {:error, %{}}
  end

  defp insert_idea!(~m{body, category, userId, assigneeId}, socket) do
    %Idea{
      body: body,
      category: category,
      retro_id: socket.assigns.retro_id,
      user_id: userId,
      assignee_id: assigneeId
    }
    |> Idea.changeset
    |> Repo.insert!
  end
end
