defmodule RemoteRetroWeb.VotingHandlers do
  alias RemoteRetro.{Repo, Retro, Vote}
  import Phoenix.Channel

  import ShorterMaps

  def handle_in("vote_submitted", %{"ideaId" => idea_id, "userId" => user_id}, socket) do
    retro_id = socket.assigns.retro_id
    user_vote_count = Retro.user_vote_count(~M{user_id, retro_id})

    if user_vote_count < 3 do
      broadcast! socket, "vote_submitted", ~m{idea_id, user_id}

      %Vote{idea_id: idea_id, user_id: user_id}
      |> Vote.changeset
      |> Repo.insert!
    end

    {:noreply, socket}
  end
end
