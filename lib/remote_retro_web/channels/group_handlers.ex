defmodule RemoteRetroWeb.GroupHandlers do
  alias RemoteRetro.{Repo, Group}

  import Phoenix.Channel
  import ShorterMaps

  def handle_in("group_edited", ~m{id,label}, socket) do
    Repo.transaction fn ->
      group =
        Group
        |> Repo.get!(id)
        |> Group.changeset(~M{label})
        |> Repo.update!()

      broadcast!(socket, "group_edited", group)
    end
    {:reply, :ok, socket}
  rescue
    _ -> {:reply, :error, socket}
  end
end
