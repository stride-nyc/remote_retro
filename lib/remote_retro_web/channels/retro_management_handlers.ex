defmodule RemoteRetroWeb.RetroManagementHandlers do
  import Phoenix.Channel

  alias RemoteRetro.{Repo}
  alias RemoteRetroWeb.{RetroManagement}

  def handle_in("retro_edited" = message, payload, socket) do
    {reply_atom, _} = atomic_update_and_broadcast(message, payload, socket)

    {:reply, reply_atom, socket}
  end

  defp atomic_update_and_broadcast(message, payload, socket) do
    Repo.transaction (fn ->
      RetroManagement.update!(socket.assigns.retro_id, payload)
      broadcast! socket, message, payload
    end)
  rescue
    _ -> {:error, %{}}
  end
end
