defmodule RemoteRetroWeb.IdeationHandlers do
  import Phoenix.Channel
  import ShorterMaps

  use SlenderChannel

  alias RemoteRetro.{Repo, Idea}

  @idea_committed "idea_committed"
  @idea_edited "idea_edited"
  @idea_deleted "idea_deleted"

  def handle_in("idea_submitted", idea_params, socket) do
    {reply_atom, _} = atomic_insert_and_broadcast(idea_params, socket)
    {:reply, reply_atom, socket}
  end

  def handle_in(@idea_edited, idea_params, socket) do
    {reply_atom, response} = atomic_update_and_broadcast_from(idea_params, socket)
    {:reply, {reply_atom, response}, socket}
  end

  def handle_in(@idea_deleted, idea_id, socket) do
    {reply_atom, _} = atomic_delete_and_broadcast(idea_id, socket)
    {:reply, reply_atom, socket}
  end

  handle_in_and_broadcast("idea_live_edit", ~m{id, liveEditText})
  handle_in_and_broadcast("idea_typing_event", ~m{userToken})
  handle_in_and_broadcast_from("idea_edit_state_enabled", ~m{id})
  handle_in_and_broadcast_from("idea_edit_state_disabled", ~m{id})
  handle_in_and_broadcast_from("idea_dragged_in_grouping_stage", ~m{id, x, y})

  defp atomic_insert_and_broadcast(idea_params, socket) do
    Repo.transaction(fn ->
      idea = insert_idea!(idea_params, socket)
      broadcast!(socket, @idea_committed, idea)
    end)
  rescue
    exception ->
      Honeybadger.notify(exception, %{handler: @idea_committed}, __STACKTRACE__)
      {:error, %{}}
  end

  defp atomic_update_and_broadcast_from(idea_params, socket) do
    Repo.transaction(fn ->
      idea =
        Repo.get(Idea, idea_params["id"])
        |> Idea.changeset(idea_params)
        |> Repo.update!()

      broadcast_from!(socket, @idea_edited, idea)

      idea
    end)
  rescue
    exception ->
      Honeybadger.notify(exception, %{handler: @idea_edited}, __STACKTRACE__)
      {:error, %{}}
  end

  defp atomic_delete_and_broadcast(idea_id, socket) do
    Repo.transaction(fn ->
      idea = Repo.delete!(%Idea{id: idea_id})
      broadcast!(socket, @idea_deleted, idea)
    end)
  rescue
    exception ->
      Honeybadger.notify(exception, %{handler: @idea_deleted}, __STACKTRACE__)
      {:error, %{}}
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
