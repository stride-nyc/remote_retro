defmodule RemoteRetroWeb.RetroManagement do
  alias RemoteRetro.{Retro, User, Group, Repo, Idea, Emails, Mailer}

  import Ecto.Query, only: [from: 2]
  import ShorterMaps

  def update!(retro_id, ~m{ideasWithEphemeralGroupingIds} = context) do
    groups = persist_groups_with_associations(retro_id, ideasWithEphemeralGroupingIds)

    context = Map.delete(context, "ideasWithEphemeralGroupingIds")

    update!(retro_id, context, %{groups: groups})
  end

  def update!(retro_id, new_attributes, aggregate_updates \\ %{}) do
    retro = update_retro_record!(retro_id, new_attributes)

    if new_attributes["stage"] == "closed" do
      Emails.action_items_email(retro_id) |> Mailer.deliver_now()

      retro
      |> Repo.preload([:participations])
      |> increment_completed_retros_count_for_participants_in()
    end

    Map.merge(%{retro: retro}, aggregate_updates)
  end

  defp persist_groups_with_associations(retro_id, ideasWithEphemeralGroupingIds) do
    all_persisted_ideas = Repo.all(from i in Idea, where: i.retro_id == ^retro_id)
    all_persisted_ideas_by_id = Enum.reduce(all_persisted_ideas, %{}, fn idea, acc -> Map.put(acc, idea.id, idea) end)

    generate_leader_id = fn (idea) -> idea["ephemeralGroupingId"] || idea["id"] end
    grouped_by_leader_id = Enum.group_by(ideasWithEphemeralGroupingIds, generate_leader_id)

    {:ok, groups} =
      Repo.transaction(fn ->
        Enum.map(grouped_by_leader_id, fn ({_leader_id, ideas_in_group}) ->
          ideas_in_group = Enum.map(ideas_in_group, &(all_persisted_ideas_by_id[&1["id"]]))

          %Group{}
          |> Ecto.Changeset.change(%{ ideas: ideas_in_group })
          |> Repo.insert!(returning: true)
        end)
      end)

    groups
  end

  defp update_retro_record!(retro_id, new_attributes) do
    Repo.get(Retro, retro_id)
    |> Retro.changeset(new_attributes)
    |> Repo.update!()
  end

  defp increment_completed_retros_count_for_participants_in(retro) do
    user_ids = Enum.map(retro.participations, fn participation -> participation.user_id end)

    from(u in User, where: u.id in ^user_ids)
    |> Repo.update_all(inc: [completed_retros_count: 1])
  end
end
