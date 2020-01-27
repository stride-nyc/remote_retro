defmodule RemoteRetroWeb.RetroChannel do
  use RemoteRetroWeb, :channel

  alias RemoteRetroWeb.{
    Presence,
    PresenceUtils,
    VotingHandlers,
    IdeationHandlers,
    RetroManagementHandlers,
    GroupHandlers
  }

  alias RemoteRetro.{Retro}

  def join("retro:" <> retro_id, _, socket) do
    socket = assign(socket, :retro_id, retro_id)
    retro = Repo.get!(Retro, retro_id) |> Repo.preload([:ideas, :votes, :users, :groups])

    send(self(), :after_join)
    {:ok, retro, socket}
  end

  def handle_info(:after_join, socket) do
    PresenceUtils.track_timestamped(socket)
    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  # delegate pattern matching and handling of idea-related messages to handler module
  def handle_in("idea_" <> _ = message_type, idea_params, socket) do
    IdeationHandlers.handle_in(message_type, idea_params, socket)
  end

  # delegate pattern matching and handling of vote-related messages to handler module
  def handle_in("vote_" <> _ = message_type, vote_params, socket) do
    VotingHandlers.handle_in(message_type, vote_params, socket)
  end

  def handle_in("retro_" <> _ = message_type, retro_params, socket) do
    RetroManagementHandlers.handle_in(message_type, retro_params, socket)
  end

  def handle_in("update_group_name" = message_type, group_params, socket) do
    GroupHandlers.handle_in(message_type, group_params, socket)
  end

  def handle_in(unhandled_message, payload, socket) do
    error_payload = %{unhandled_message: %{type: unhandled_message, payload: payload}}
    Honeybadger.notify(error_payload, %{retro_id: socket.assigns.retro_id})

    {:reply, {:error, error_payload}, socket}
  end
end
