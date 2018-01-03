defmodule RemoteRetro.RetroChannel do
  use RemoteRetro.Web, :channel

  alias RemoteRetro.{Presence, PresenceUtils, Idea, Emails, Mailer, Retro, Vote}

  def join("retro:" <> retro_id, _, socket) do
    socket = assign(socket, :retro_id, retro_id)
    retro = retrieve_retro_with_associations(retro_id)

    send self(), :after_join
    {:ok, retro, socket}
  end

  def handle_info(:after_join, socket) do
    PresenceUtils.track_timestamped(socket)
    push socket, "presence_state", Presence.list(socket)
    {:noreply, socket}
  end

  def handle_in("enable_edit_state", %{"idea" => idea, "editorToken" => editorToken}, socket) do
    broadcast! socket, "enable_edit_state", %{
      "id" => idea["id"],
      "editorToken" => editorToken
    }
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

  def handle_in("new_idea", %{"body" => body, "category" => "action-item", "userId" => user_id, "assigneeId" => assignee_id}, socket) do
    idea =
      %Idea{
        body: body,
        category: "action-item",
        retro_id: socket.assigns.retro_id,
        user_id: user_id,
        assignee_id: assignee_id
      }
      |> Idea.changeset
      |> Repo.insert!

      broadcast! socket, "new_idea_received", idea
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

    broadcast! socket, "new_idea_received", idea
    {:noreply, socket}
  end

  def handle_in("idea_edited", %{"id" => id, "body" => body, "category" => category}, socket) do
    idea =
      Repo.get(Idea, id)
      |> Idea.changeset(%{body: body, category: category})
      |> Repo.update!

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
    query = from votes in Vote,
              join: ideas in Idea,
              where: votes.idea_id == ideas.id
              and ideas.retro_id == ^retro_id
              and votes.user_id == ^user_id

    user_vote_count = Repo.aggregate(query, :count, :id)

    if user_vote_count < 3 do
      broadcast! socket, "vote_submitted", %{"idea_id" => idea_id, "user_id" => user_id}

      %Vote{
        idea_id: idea_id,
        user_id: user_id
      }
      |> Vote.changeset
      |> Repo.insert!
    end

    {:noreply, socket}
  end

  def handle_in("proceed_to_next_stage", %{"stage" => "closed"}, socket) do
    retro_id = socket.assigns.retro_id
    update_retro!(retro_id, "closed")
    Emails.action_items_email(retro_id) |> Mailer.deliver_now

    broadcast! socket, "proceed_to_next_stage", %{"stage" => "closed"}
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

  defp retrieve_retro_with_associations(retro_id) do
    query =
      from retro in Retro,
      where: retro.id == ^retro_id,
      left_join: ideas in assoc(retro, :ideas), on: ideas.retro_id == retro.id,
      left_join: votes in assoc(retro, :votes), on: votes.idea_id == ideas.id,
      preload: [ideas: ideas, votes: votes]

    Repo.one!(query)
  end
end
