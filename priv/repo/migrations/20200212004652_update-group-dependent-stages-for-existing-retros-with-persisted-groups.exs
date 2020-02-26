defmodule :"Elixir.RemoteRetro.Repo.Migrations.Update-group-dependent-stages-for-existing-retros-with-persisted-groups" do
  use Ecto.Migration
  alias RemoteRetro.{Repo, Retro, Group}

  def up do
    retros_with_persisted_groups()
    |> Enum.filter(fn retro -> retro.stage == "action-items" end)
    |> Enum.each(fn retro ->
      Repo.update!(
        Retro.changeset(retro, %{stage: "groups-action-items"})
      )
    end)

    retros_with_persisted_groups()
    |> Enum.filter(fn retro -> retro.stage == "closed" end)
    |> Enum.each(fn retro ->
      Repo.update!(
        Retro.changeset(retro, %{stage: "groups-closed"})
      )
    end)
  end

  def down do
    retros_with_persisted_groups()
    |> Enum.filter(fn retro -> retro.stage == "groups-action-items" end)
    |> Enum.each(fn retro ->
      Repo.update!(
        Retro.changeset(retro, %{stage: "action-items"})
      )
    end)

    retros_with_persisted_groups()
    |> Enum.filter(fn retro -> retro.stage == "groups-closed" end)
    |> Enum.each(fn retro ->
      Repo.update!(
        Retro.changeset(retro, %{stage: "closed"})
      )
    end)
  end

  defp retros_with_persisted_groups do
    Repo.all(Retro)
    |> Repo.preload(:groups)
    |> Enum.filter(fn retro -> Enum.any?(retro.groups) end)
  end
end
