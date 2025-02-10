defmodule RemoteRetroWeb.GroupHandlers do
  alias RemoteRetro.{Repo, Group}

  import Phoenix.Channel

  @group_edited "group_edited"

  def handle_in(@group_edited, %{id: id, label: label}, socket) do
    Repo.transaction(fn ->
      group =
        Group
        |> Repo.get!(id)
        |> Group.changeset(%{label: label})
        |> Repo.update!()

      broadcast!(socket, @group_edited, group)
    end)

    {:reply, :ok, socket}
  rescue
    exception ->
      Honeybadger.notify(exception, metadata: %{handler: @group_edited}, stacktrace: __STACKTRACE__)
      {:reply, :error, socket}
  end
end
