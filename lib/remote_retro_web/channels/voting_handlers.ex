defmodule RemoteRetroWeb.VotingHandlers do
  alias RemoteRetro.{Repo, Vote}
  import Phoenix.Channel

  import ShorterMaps

  @vote_submitted "vote_submitted"
  @vote_retracted "vote_retracted"

  def handle_in(@vote_submitted, ~m{idea_id, user_id}, socket) do
    reply_tuple = atomic_insert_and_broadcast_to_other_clients(idea_id, user_id, socket)

    {:reply, reply_tuple, socket}
  end

  def handle_in(@vote_retracted, %{"id" => id}, socket) do
    Repo.transaction(fn ->
      %Vote{id: id} |> Repo.delete!()
      broadcast_from!(socket, @vote_retracted, %{"id" => id})
    end)

    {:reply, :ok, socket}
  rescue
    exception ->
      Honeybadger.notify(exception, metadata:  %{handler: @vote_retracted}, stacktrace: __STACKTRACE__)
      {:reply, :error, socket}
  end

  defp atomic_insert_and_broadcast_to_other_clients(idea_id, user_id, socket) do
    Repo.transaction(fn ->
      vote = insert_vote!(idea_id, user_id)
      broadcast_from!(socket, @vote_submitted, vote)
      vote
    end)
  rescue
    exception ->
      Honeybadger.notify(exception, metadata: %{handler: @vote_submitted}, stacktrace: __STACKTRACE__)
      {:error, %{}}
  end

  defp insert_vote!(idea_id, user_id) do
    %Vote{idea_id: idea_id, user_id: user_id}
    |> Vote.changeset()
    |> Repo.insert!()
  end
end
