defmodule RemoteRetroWeb.RetroChannel do
  use RemoteRetroWeb, :channel

  alias RemoteRetroWeb.{
    Presence,
    PresenceUtils,
    VotingHandlers,
    IdeationHandlers,
    RetroManagementHandlers,
    GroupHandlers,
    UserHandlers
  }

  alias RemoteRetro.{Retro}

  def join("retro:" <> retro_id, _, socket) do
    socket = assign(socket, :retro_id, retro_id)

    # TODO: given that we already have the retro id, I don't think we need to first get the retro before we initiate the preloads.
    # should be able to happen in parallel
    retro = Repo.get!(Retro, retro_id) |> Repo.preload([:ideas, :votes, :users, :groups])

    send(self(), :after_join)
    {:ok, retro, socket}
  end

  def handle_info(:after_join, socket) do
    PresenceUtils.track_timestamped(socket)
    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  def handle_in("idea_" <> _ = message_type, idea_params, socket) do
    IdeationHandlers.handle_in(message_type, idea_params, socket)
  end

  def handle_in("vote_" <> _ = message_type, vote_params, socket) do
    VotingHandlers.handle_in(message_type, vote_params, socket)
  end

  def handle_in("retro_" <> _ = message_type, retro_params, socket) do
    RetroManagementHandlers.handle_in(message_type, retro_params, socket)
  end

  def handle_in("group_edited" = message_type, group_params, socket) do
    GroupHandlers.handle_in(message_type, group_params, socket)
  end

  def handle_in("user_edited" = message_type, user_params, socket) do
    UserHandlers.handle_in(message_type, user_params, socket)
  end

  def handle_in(unhandled_message, payload, socket) do
    error_payload = %{unhandled_message: %{type: unhandled_message, payload: payload}}
    Honeybadger.notify(error_payload, metadata: %{retro_id: socket.assigns.retro_id})

    {:reply, {:error, error_payload}, socket}
  end
end
