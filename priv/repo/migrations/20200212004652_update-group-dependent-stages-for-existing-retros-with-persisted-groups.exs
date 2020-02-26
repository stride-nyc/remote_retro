defmodule :"Elixir.RemoteRetro.Repo.Migrations.Update-group-dependent-stages-for-existing-retros-with-persisted-groups" do
  use Ecto.Migration
  alias RemoteRetro.{Repo, Retro}
  import Ecto.Query, only: [from: 2]

  def up do
    subset_of_retro_ids_needing_changes = retro_ids_for_retros_with_persisted_groups()

    query = from(retro in Retro, where: retro.id in ^subset_of_retro_ids_needing_changes and retro.stage == "action-items")
    Repo.update_all(query, set: [stage: "groups-action-items"])

    query = from(retro in Retro, where: retro.id in ^subset_of_retro_ids_needing_changes and retro.stage == "closed")
    Repo.update_all(query, set: [stage: "groups-closed"])
  end

  def down do
    subset_of_retro_ids_needing_changes = retro_ids_for_retros_with_persisted_groups()

    query = from(retro in Retro, where: retro.id in ^subset_of_retro_ids_needing_changes and retro.stage == "groups-action-items")
    Repo.update_all(query, set: [stage: "action-items"])

    query = from(retro in Retro, where: retro.id in ^subset_of_retro_ids_needing_changes and retro.stage == "groups-closed")
    Repo.update_all(query, set: [stage: "closed"])
  end

  defp retro_ids_for_retros_with_persisted_groups do
    Repo.all(Retro)
    |> Repo.preload(:groups)
    |> Enum.filter(fn retro -> Enum.any?(retro.groups) end)
    |> Enum.map(fn retro -> retro.id end)
  end
end
