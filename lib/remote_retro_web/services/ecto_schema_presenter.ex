defmodule RemoteRetroWeb.EctoSchemaPresenter do

  @static_ecto_schema_metadata_attributes [:__meta__, :__struct__]

  def drop_metadata(ecto_schema_struct) do
    ecto_schema_struct
    |> Map.drop(@static_ecto_schema_metadata_attributes)
    |> drop_associations_that_havent_been_preloaded
  end

  defp drop_associations_that_havent_been_preloaded(ecto_schema_struct) do
    associations_to_drop =
      ecto_schema_struct
      |> Map.keys()
      |> Enum.filter(fn key ->
        case Map.get(ecto_schema_struct, key) do
          %Ecto.Association.NotLoaded{} -> true
          _ -> false
        end
      end)

    Map.drop(ecto_schema_struct, associations_to_drop)
  end
end
