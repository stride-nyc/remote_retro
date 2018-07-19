defmodule RemoteRetroWeb.VotingHandlers do
  alias RemoteRetro.{Repo, Retro, Vote}
  import Phoenix.Channel

  import ShorterMaps

  def handle_in("vote_submitted", %{"ideaId" => idea_id, "userId" => user_id}, socket) do
    retro_id = socket.assigns.retro_id
    user_vote_count = Retro.user_vote_count(~M{user_id, retro_id})

    reply_atom =
      if user_vote_count < 3 do
        insert_and_broadcast(idea_id, user_id, socket)
      else
        :ok
      end

    {:reply, reply_atom, socket}
  end

  defp insert_and_broadcast(idea_id, user_id, socket) do
    try do
      insert_vote!(idea_id, user_id)
      broadcast! socket, "vote_submitted", ~m{idea_id, user_id}
      :ok
    rescue
      _ -> :error
    end
  end

  defp insert_vote!(idea_id, user_id) do
    %Vote{idea_id: idea_id, user_id: user_id}
    |> Vote.changeset
    |> Repo.insert!
  end
end
