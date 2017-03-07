defmodule RemoteRetro.RetroChannel do
  use RemoteRetro.Web, :channel
  alias RemoteRetro.Presence
  alias RemoteRetro.PresenceUtils
  alias RemoteRetro.Idea

  def join("retro:" <> retro_id, _, socket) do
    query = from idea in Idea, select: map(idea, [:body, :category, :inserted_at, :retro_id]), where: idea.retro_id == ^retro_id
    existing_ideas = Repo.all(query)
    socket_ideas = Phoenix.Socket.assign(socket, :ideas, existing_ideas)
    socket_retro = Phoenix.Socket.assign(socket_ideas, :retro_id, retro_id)

    send self(), :after_join
    {:ok, socket_retro}
  end

  def handle_info(:after_join, socket) do
    {:ok, user} = Phoenix.Token.verify(socket, "user", socket.assigns.token)
    user_stamped = Map.put(user, :online_at, :os.system_time(:milli_seconds))
    Presence.track(socket, socket.assigns.token, user_stamped)

    push socket, "presence_state", Presence.list(socket)
    push socket, "existing_ideas", %{ideas: socket.assigns.ideas}
    {:noreply, socket}
  end

  def handle_in("new_idea", %{"body" => body, "category" => category}, socket) do
    changeset = Idea.changeset(%Idea{body: body, category: category, retro_id: socket.assigns.retro_id})
    _idea = Repo.insert!(changeset)

    broadcast! socket, "new_idea_received", %{body: body, category: category}
    {:noreply, socket}
  end

  intercept ["presence_diff"]
  def handle_out("presence_diff", _msg, socket) do
    presences = Presence.list(socket)
    new_state = PresenceUtils.give_facilitator_role_to_longest_tenured(presences)

    push socket, "presence_state", new_state
    {:noreply, socket}
  end
end
