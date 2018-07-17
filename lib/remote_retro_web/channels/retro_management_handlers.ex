defmodule RemoteRetroWeb.RetroManagementHandlers do
  import Phoenix.Channel
  import ShorterMaps

  alias RemoteRetro.{Emails, Mailer, Repo, Retro}

  def handle_in("retro_edited", %{"stage" => "closed"}, socket) do
    retro_id = socket.assigns.retro_id
    update_retro!(retro_id, "closed")
    Emails.action_items_email(retro_id) |> Mailer.deliver_now

    broadcast! socket, "retro_edited", %{"stage" => "closed"}
    {:noreply, socket}
  end

  def handle_in("retro_edited", ~m{stage}, socket) do
    update_retro!(socket.assigns.retro_id, stage)

    broadcast! socket, "retro_edited", ~m{stage}
    {:noreply, socket}
  end

  defp update_retro!(retro_id, stage) do
    Repo.get(Retro, retro_id)
    |> Retro.changeset(~m{stage})
    |> Repo.update!
  end
end
