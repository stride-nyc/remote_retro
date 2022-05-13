defmodule RemoteRetroWeb.RetroManagement do
  alias RemoteRetro.{Retro, User, Group, Repo, Idea, Emails, Mailer}

  import Ecto.Query, only: [from: 2]
  import ShorterMaps

  def update!(retro_id, ~m{ideasWithEphemeralGroupingIds} = context) do
    updates_map = persist_groups_with_associated_ideas(retro_id, ideasWithEphemeralGroupingIds)

    context = Map.delete(context, "ideasWithEphemeralGroupingIds")

    update!(retro_id, context, updates_map)
  end

  def update!(retro_id, new_attributes, aggregate_updates \\ %{}) do
    retro = update_retro_record!(retro_id, new_attributes)

    if retro_advancing_to_a_closed_state?(new_attributes) do
      Emails.action_items_email(retro_id) |> Mailer.deliver_now!()

      retro
      |> Repo.preload([:participations])
      |> increment_completed_retros_count_for_participants_in()
    end

    Map.merge(%{retro: retro}, aggregate_updates)
  end

  defp retro_advancing_to_a_closed_state?(new_attributes) do
    new_attributes["stage"] && new_attributes["stage"] =~ ~r/closed/
  end

  defp persist_groups_with_associated_ideas(retro_id, ideasWithEphemeralGroupingIds) do
    all_persisted_ideas = Repo.all(from i in Idea, where: i.retro_id == ^retro_id)
    all_persisted_ideas_by_id = Enum.reduce(all_persisted_ideas, %{}, fn idea, acc -> Map.put(acc, idea.id, idea) end)

    generate_leader_id = fn (idea) -> idea["ephemeralGroupingId"] || idea["id"] end
    grouped_by_leader_id = Enum.group_by(ideasWithEphemeralGroupingIds, generate_leader_id)

    {:ok, groups} =
      Repo.transaction(fn ->
        Enum.map(grouped_by_leader_id, fn ({_leader_id, ideas_in_group}) ->
          ideas_in_group_as_changesets = ensure_ideas_in_group_have_latest_ephemeral_coordinates(
            ideas_in_group,
            all_persisted_ideas_by_id
          )

          %Group{}
          |> Ecto.Changeset.change(%{ ideas: ideas_in_group_as_changesets })
          |> Repo.insert!(returning: true)
        end)
      end)

    normalize_groups_and_ideas(groups)
  end

  defp ensure_ideas_in_group_have_latest_ephemeral_coordinates(ideas_in_group, all_persisted_ideas_by_id) do
    Enum.map(ideas_in_group, fn idea ->
      persisted_idea = all_persisted_ideas_by_id[idea["id"]]
      Idea.changeset(persisted_idea, %{x: idea["x"], y: idea["y"]})
    end)
  end

  defp normalize_groups_and_ideas(groups) do
    Enum.reduce(groups, %{groups: [], ideas: []}, fn(group, ~M{groups, ideas} = acc) ->
      Map.merge(acc, %{groups: [group | groups], ideas: group.ideas ++ ideas})
    end)
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
