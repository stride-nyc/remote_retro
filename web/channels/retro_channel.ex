defmodule RemoteRetro.RetroChannel do
  use RemoteRetro.Web, :channel
  alias RemoteRetro.Presence
  alias RemoteRetro.Idea

  def join("retro:" <> retro_id, _, socket) do
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
