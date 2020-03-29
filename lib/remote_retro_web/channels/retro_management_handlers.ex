defmodule RemoteRetroWeb.RetroManagementHandlers do
  import Phoenix.Channel

  alias RemoteRetro.{Repo}
  alias RemoteRetroWeb.{RetroManagement, EctoSchemaPresenter}

  @retro_edited "retro_edited"

  def handle_in(@retro_edited = message, payload, socket) do
    {reply_atom, _} = atomic_update_and_broadcast(message, payload, socket)

    {:reply, reply_atom, socket}
  end

  defp atomic_update_and_broadcast(message, payload, socket) do
    Repo.transaction(fn ->
      updates = RetroManagement.update!(socket.assigns.retro_id, payload)
      updates = ensure_serialization_of_updates(updates)
      broadcast!(socket, message, updates)
    end)
  rescue
    exception ->
      Honeybadger.notify(exception, %{handler: @retro_edited}, __STACKTRACE__)
      {:error, %{}}
  end

  defp ensure_serialization_of_updates(updates) do
    %{retro: retro_ecto_schema} = updates

    serializable_retro = EctoSchemaPresenter.drop_metadata(retro_ecto_schema)

    Map.put(updates, :retro, serializable_retro)
  end
end
