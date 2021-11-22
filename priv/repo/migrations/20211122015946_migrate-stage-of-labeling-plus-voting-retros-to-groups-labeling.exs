defmodule :"Elixir.RemoteRetro.Repo.Migrations.Migrate-stage-of-labeling-plus-voting-retros-to-groups-labeling" do
  use Ecto.Migration
  alias RemoteRetro.{Repo, Retro}
  import Ecto.Query, only: [from: 2]

  def up do
    query = from r in Retro,
       where: r.stage == "labeling-plus-voting"
    retros_needing_updates = Repo.all(query) |> Repo.preload([:votes])

    retros_to_set_to_groups_labeling = Enum.filter(retros_needing_updates, fn retro -> Kernel.length(retro.votes) == 0 end)
    retros_to_set_to_groups_voting = Enum.filter(retros_needing_updates, fn retro -> Kernel.length(retro.votes) !== 0 end)

    Repo.transaction fn ->
      Enum.each(retros_to_set_to_groups_labeling, fn retro ->
        retro
        |> Retro.changeset(%{stage: "groups-labeling"})
        |> Repo.update!()
      end)

      Enum.each(retros_to_set_to_groups_voting, fn retro ->
        retro
        |> Retro.changeset(%{stage: "groups-voting"})
        |> Repo.update!()
      end)
    end
  end

  def down do
    query = from r in Retro,
       where: r.stage in ["groups-labeling", "groups-voting"]
    retros_needing_updates = Repo.all(query)

    Enum.each(retros_needing_updates, fn retro ->
      retro
      |> Retro.changeset(%{stage: "labeling-plus-voting"})
      |> Repo.update!()
    end)
  end
end
