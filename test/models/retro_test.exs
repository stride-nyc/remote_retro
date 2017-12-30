defmodule RemoteRetro.RetroTest do
  use RemoteRetro.ModelCase

  alias RemoteRetro.Retro

  test "stage must be one of the retro stages" do
    changeset = Retro.changeset(%Retro{}, %{stage: "Total. Friggin. Mayhem."})
    { stage_error, _ } = Keyword.fetch!(changeset.errors, :stage)
    assert stage_error == "is invalid"

    changeset = Retro.changeset(%Retro{}, %{stage: "action-items"})
    assert length(changeset.errors) == 0
  end

  describe "JSON encoding of the model struct" do
    test "is enabled" do
      retro = %Retro{id: 5, stage: "idea-generation", ideas: [], votes: []}

      encoded = Poison.encode!(retro)

      assert encoded =~ ~r/"id":5/i
      assert encoded =~ ~r/"stage":"idea-generation"/i
    end
  end
end
