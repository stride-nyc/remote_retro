defmodule RemoteRetro.EctoSchemaPresenterTest do
  use ExUnit.Case, async: true

  alias RemoteRetro.Retro
  alias RemoteRetroWeb.EctoSchemaPresenter

  import ShorterMaps

  describe "given an ecto schema struct" do
    setup [:build_retro_schema_struct]

    test "removal of :__meta__ metadata", ~M{retro_schema_struct} do
      input_has_meta_key = Map.has_key?(retro_schema_struct, :__meta__)

      result = EctoSchemaPresenter.drop_metadata(retro_schema_struct)

      output_lacks_meta_key = !Map.has_key?(result, :__meta__)

      assert input_has_meta_key && output_lacks_meta_key
    end

    test "removal of :__struct__ metadata", ~M{retro_schema_struct} do
      input_has_struct_key = Map.has_key?(retro_schema_struct, :__struct__)

      result = EctoSchemaPresenter.drop_metadata(retro_schema_struct)

      output_lacks_struct_key = !Map.has_key?(result, :__struct__)

      assert input_has_struct_key && output_lacks_struct_key
    end

    test "removal of any references to unloaded associations", ~M{retro_schema_struct} do
      assert %Retro{
        action_items: %Ecto.Association.NotLoaded{},
      } = retro_schema_struct

      result = EctoSchemaPresenter.drop_metadata(retro_schema_struct)

      refute Map.has_key?(result, :action_items)
    end
  end

  defp build_retro_schema_struct(context) do
    retro_schema_struct = Retro.changeset(%Retro{}, %{}).data

    Map.put(context, :retro_schema_struct, retro_schema_struct)
  end
end
