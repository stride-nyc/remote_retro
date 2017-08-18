defmodule RemoteRetro.RetroChannel do
  use RemoteRetro.Web, :channel

  alias Ecto.Multi
  alias RemoteRetro.{Presence, PresenceUtils, Idea, Emails, Mailer, Retro, Participation}

  def join("retro:" <> retro_id, _, socket) do
    socket = assign(socket, :retro_id, retro_id)
    retro = Repo.get!(Retro, retro_id) |> Repo.preload(ideas: :user)

    send self(), :after_join
    {:ok, retro, socket}
  end

  def handle_info(:after_join, socket) do
    PresenceUtils.track_timestamped(socket)
    push socket, "presence_state", Presence.list(socket)
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

  def handle_in("highlight_idea", %{"id" => id, "isHighlighted" => is_highlighted}, socket) do
    broadcast! socket, "idea_highlighted", %{"id" => id, "isHighlighted" => is_highlighted}
    {:noreply, socket}
  end

  def handle_in("new_idea", %{"body" => body, "category" => category, "userId" => user_id}, socket) do
    idea =
      %Idea{
        body: body,
        category: category,
        retro_id: socket.assigns.retro_id,
        user_id: user_id
      }
      |> Idea.changeset
      |> Repo.insert!
      |> Repo.preload(:user)

    broadcast! socket, "new_idea_received", idea
    {:noreply, socket}
  end

  def handle_in("idea_edited", %{"id" => id, "body" => body}, socket) do
    idea =
      Repo.get(Idea, id)
      |> Idea.changeset(%{body: body})
      |> Repo.update!
      |> Repo.preload(:user)

    broadcast! socket, "idea_edited", idea
    {:noreply, socket}
  end

  def handle_in("delete_idea", id, socket) do
    idea = Repo.delete!(%Idea{id: id})

    broadcast! socket, "idea_deleted", idea
    {:noreply, socket}
  end

  def handle_in("submit_vote", %{"ideaId" => idea_id, "userId" => user_id}, socket) do
    retro_id = socket.assigns.retro_id
    idea_query = from i in Idea, where: i.id == ^idea_id
    participation_query = from p in Participation, where: p.user_id == ^user_id and p.retro_id == ^retro_id

    result =
      Multi.new
      |> Multi.update_all(:idea, idea_query, [inc: [vote_count: 1]], returning: true)
      |> Multi.update_all(:participation, participation_query, [inc: [vote_count: 1]], returning: true)
      |> Repo.transaction

    result_to_send =
      case result do
        {:ok, %{idea: {_idea_row_count, [updated_idea]}, participation: {_particip_row_count, [_updated_participation]}}} ->
          updated_idea
        {:ok, %{idea: {0, []}, participation: {0, []}}} ->
          %{error: "no participation or idea found"}
        {:ok, %{idea: {1, [_updated_idea]}, participation: {0, []}}} ->
          %{error: "no participation found"}
        {:ok, %{idea: {0, []}, participation: {1, [_updated_participation]}}} ->
          %{error: "no idea found"}
      end

    broadcast! socket, "vote_submitted", result_to_send
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

  defp update_retro!(retro_id, stage) do
    Repo.get(Retro, retro_id)
    |> Retro.changeset(%{stage: stage})
    |> Repo.update!
  end
end
