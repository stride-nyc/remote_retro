defmodule RemoteRetroWeb.IdeationHandlers do
  import Phoenix.Channel
  import ShorterMaps

  use SlenderChannel

  alias RemoteRetro.{Repo, Data}
  alias Data.Idea

  def handle_in("idea_submitted", idea_params, socket) do
    {reply_atom, _} = atomic_insert_and_broadcast(idea_params, socket)
    {:reply, reply_atom, socket}
  end

  def handle_in("idea_edited", idea_params, socket) do
    {reply_atom, _} = atomic_update_and_broadcast(idea_params, socket)
    {:reply, reply_atom, socket}
  end

  def handle_in("idea_deleted", idea_id, socket) do
    {reply_atom, _} = atomic_delete_and_broadcast(idea_id, socket)
    {:reply, reply_atom, socket}
  end

  handle_in_and_broadcast("idea_live_edit", ~m{id, liveEditText})
  handle_in_and_broadcast("idea_typing_event", ~m{userToken})
  handle_in_and_broadcast_from("idea_edit_state_enabled", ~m{id})
  handle_in_and_broadcast_from("idea_edit_state_disabled", ~m{id})

  defp atomic_insert_and_broadcast(idea_params, socket) do
    Repo.transaction(fn ->
      idea = insert_idea!(idea_params, socket)
      broadcast!(socket, "idea_committed", idea)
    end)
  rescue
    _ -> {:error, %{}}
  end

  defp atomic_update_and_broadcast(~m{id, body, category, assignee_id}, socket) do
    Repo.transaction(fn ->
      idea =
        Repo.get(Idea, id)
        |> Idea.changeset(~M{body, category, assignee_id})
        |> Repo.update!()

      broadcast!(socket, "idea_edited", idea)
    end)
  rescue
    _ -> {:error, %{}}
  end

  defp atomic_delete_and_broadcast(idea_id, socket) do
    Repo.transaction(fn ->
      idea = Repo.delete!(%Idea{id: idea_id})
      broadcast!(socket, "idea_deleted", idea)
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
      assignee_id: assigneeId,
    }
    |> Idea.changeset()
    |> Repo.insert!()
  end
end
