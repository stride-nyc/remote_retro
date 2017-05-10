defmodule RemoteRetro.RetroChannel do
  use RemoteRetro.Web, :channel

  alias RemoteRetro.{Presence, PresenceUtils, Idea, Emails, Mailer, Retro}
  alias Phoenix.Socket

  def join("retro:" <> retro_id, _, socket) do
    socket = Socket.assign(socket, :retro_id, retro_id)

    send self(), :after_join
    {:ok, socket}
  end

  def handle_info(:after_join, %{assigns: assigns} = socket) do
    PresenceUtils.track_timestamped(socket)

    retro = Repo.get!(Retro, assigns.retro_id) |> Repo.preload(:ideas)
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

  def handle_in("user_typing_idea", %{"userToken" => userToken}, socket) do
    broadcast! socket, "user_typing_idea", %{"userToken" => userToken}
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
      |> Idea.changeset(%{body: body})
      |> Repo.update!

    broadcast! socket, "idea_edited", idea
    {:noreply, socket}
  end

  def handle_in("delete_idea", id, socket) do
    idea = Repo.delete!(%Idea{id: id})

    broadcast! socket, "idea_deleted", idea
    {:noreply, socket}
  end

  def handle_in("proceed_to_next_stage", %{"stage" => "action-item-distribution"}, socket) do
    retro_id = socket.assigns.retro_id
    update_retro!(retro_id, "action-item-distribution")
    Emails.action_items_email(retro_id) |> Mailer.deliver_now

    broadcast! socket, "proceed_to_next_stage", %{"stage" => "action-item-distribution"}
    {:noreply, socket}
  end

  def handle_in("proceed_to_next_stage", %{"stage" => stage}, socket) do
    update_retro!(socket.assigns.retro_id, stage)

    broadcast! socket, "proceed_to_next_stage", %{"stage" => stage}
    {:noreply, socket}
  end

  intercept ["presence_diff"]
  def handle_out("presence_diff", _msg, socket) do
    new_state = Presence.list(socket) |> PresenceUtils.give_facilitator_role_to_longest_tenured

    push socket, "presence_state", new_state
    {:noreply, socket}
  end

  defp update_retro!(retro_id, stage) do
    Repo.get(Retro, retro_id)
    |> Retro.changeset(%{stage: stage})
    |> Repo.update!
  end
end
