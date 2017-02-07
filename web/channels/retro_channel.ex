defmodule RemoteRetro.RetroChannel do
  use RemoteRetro.Web, :channel
  alias RemoteRetro.Presence
  alias RemoteRetro.Idea

  def join("retro:" <> retro_id, _, socket) do
    query = from idea in Idea, select: map(idea, [:body, :category, :inserted_at, :retro_id]), where: idea.retro_id == ^retro_id
    existing_ideas = Repo.all(query)
    socket = Phoenix.Socket.assign(socket, :ideas, existing_ideas)
    socket = Phoenix.Socket.assign(socket, :retro_id, retro_id)
    send self(), :after_join
    {:ok, socket}
  end

  def handle_info(:after_join, socket) do
    Presence.track(socket, socket.assigns.user, %{
      online_at: :os.system_time(:milli_seconds)
    })
    push socket, "presence_state", Presence.list(socket)
    {:noreply, socket}
  end

  def handle_in("new_idea", %{"body" => body, "category" => category}, socket) do
    changeset = Idea.changeset(%Idea{ body: body, category: category, retro_id: socket.assigns.retro_id })
    idea = Repo.insert!(changeset)

    broadcast! socket, "new_idea_received", %{ body: body, category: category }
    {:noreply, socket}
  end
end
