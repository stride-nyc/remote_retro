defmodule RemoteRetroWeb.RetroManagement do
  alias RemoteRetro.{Retro, User, Repo, Emails, Mailer}

  import Ecto.Query, only: [from: 2]

  def update!(retro_id, new_attributes) do
    retro = update_retro_record!(retro_id, new_attributes)

    if new_attributes["stage"] == "closed" do
      Emails.action_items_email(retro_id) |> Mailer.deliver_now

      increment_completed_retros_count_for_participants_in(retro)
    end
  end

  defp update_retro_record!(retro_id, new_attributes) do
    Repo.get(Retro, retro_id)
    |> Repo.preload([:participations])
    |> Retro.changeset(new_attributes)
    |> Repo.update!
  end

  defp increment_completed_retros_count_for_participants_in(retro) do
    user_ids = Enum.map(retro.participations, fn(participation) -> participation.user_id end)

    from(u in User, where: u.id in ^user_ids)
    |> Repo.update_all(inc: [completed_retros_count: 1])
  end
end
