defmodule RemoteRetroWeb.RetroManagementHandlers do
  import Phoenix.Channel
  import ShorterMaps

  alias RemoteRetro.{Emails, Mailer, Repo, Retro}

  def handle_in("retro_edited" = message, payload, socket) do
    {reply_atom, _} = atomic_update_and_broadcast(socket, payload, message)

    {:reply, reply_atom, socket}
  end

  defp atomic_update_and_broadcast(socket, payload, message) do
    Repo.transaction (fn ->
      retro_id = socket.assigns.retro_id
      update_retro!(retro_id, payload)

      if payload["stage"] == "closed" do
        Emails.action_items_email(retro_id) |> Mailer.deliver_now
      end

      broadcast! socket, message, payload
    end)
  rescue
    _ -> {:error, %{}}
  end

  defp update_retro!(retro_id, payload) do
    Repo.get(Retro, retro_id)
    |> Retro.changeset(payload)
    |> Repo.update!
  end
end
