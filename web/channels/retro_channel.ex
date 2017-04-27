defmodule RemoteRetro.RetroChannel do
  @moduledoc """
  Implement our Retro channel.
  """

  use RemoteRetro.Web, :channel
  alias RemoteRetro.{Presence, PresenceUtils, Idea, Emails, Mailer, Retro}
  alias Phoenix.{Socket, Token}

  def join("retro:" <> retro_id, _, socket) do
    socket = Socket.assign(socket, :retro_id, retro_id)

    send self(), :after_join
    {:ok, socket}
  end

  def handle_info(:after_join, %{assigns: assigns} = socket) do
    track_timestamped_presence(socket)

    retro = Repo.get!(Retro, assigns.retro_id) |> Repo.preload(:ideas)
    push socket, "presence_state", Presence.list(socket)
    push socket, "retro_state", retro
    {:noreply, socket}
  end

  def handle_in("enable_edit_state", %{"id" => id}, socket) do
    broadcast! socket, "enable_edit_state", %{"id" => id}
    {:noreply, socket}
  end

  def handle_in("disable_edit_state", %{"id" => id}, socket) do
    broadcast! socket, "disable_edit_state", %{"id" => id}
    {:noreply, socket}
  end

  def handle_in("idea_live_edit", %{"id" => id, "liveEditText" => live_edit_text}, socket) do
    broadcast! socket, "idea_live_edit", %{"id" => id, "liveEditText" => live_edit_text}
    {:noreply, socket}
  end

  def handle_in("new_idea", %{"body" => body, "category" => category, "author" => author}, socket) do
    idea =
      %Idea{body: body, category: category, retro_id: socket.assigns.retro_id, author: author}
      |> Idea.changeset
      |> Repo.insert!

    broadcast! socket, "new_idea_received", idea
    {:noreply, socket}
  end

  def handle_in("idea_edited", %{"id" => id, "body" => body}, socket) do
    idea =
      Repo.get(Idea, id)
      |> Ecto.Changeset.change(body: body)
      |> Repo.update!

    broadcast! socket, "idea_edited", idea
    {:noreply, socket}
  end

  def handle_in("delete_idea", id, socket) do
    idea = RemoteRetro.Repo.delete!(%Idea{id: id})

    broadcast! socket, "idea_deleted", idea
    {:noreply, socket}
  end

  def handle_in("proceed_to_next_stage", %{"stage" => "action-item-distribution"}, socket) do
    %{retro_id: retro_id} = socket.assigns
    email_send_status = Emails.action_items_email(retro_id) |> Mailer.deliver_now

    push socket, "email_send_status", %{"success" => !!email_send_status}
    {:noreply, socket}
  end

  def handle_in("proceed_to_next_stage", %{"stage" => stage}, socket) do
    Repo.get(Retro, socket.assigns.retro_id)
    |> Ecto.Changeset.change(stage: stage)
    |> Repo.update!

    broadcast! socket, "proceed_to_next_stage", %{"stage" => stage}
    {:noreply, socket}
  end

  intercept ["presence_diff"]
  def handle_out("presence_diff", _msg, socket) do
    presences = Presence.list(socket)
    new_state = PresenceUtils.give_facilitator_role_to_longest_tenured(presences)

    push socket, "presence_state", new_state
    {:noreply, socket}
  end

  defp track_timestamped_presence(%{assigns: %{user_token: user_token}} = socket) do
    {:ok, user} = Token.verify(socket, "user", user_token)
    user = Map.put(user, :online_at, :os.system_time)
    Presence.track(socket, user_token, user)
  end
end
