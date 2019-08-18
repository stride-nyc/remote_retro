defmodule RemoteRetro.RetroTest do
  use RemoteRetro.DataCase

  alias RemoteRetro.Retro

  test "stage must be one of the retro stages" do
    retro = %Retro{facilitator_id: 1}
    changeset = Retro.changeset(retro, %{stage: "Total. Friggin. Mayhem."})
    {stage_error, _} = Keyword.fetch!(changeset.errors, :stage)
    assert stage_error == "is invalid"

    changeset = Retro.changeset(retro, %{stage: "action-items"})
    assert length(changeset.errors) == 0
  end

  test "format must be a valid retro format" do
    retro = %Retro{facilitator_id: 1}
    changeset = Retro.changeset(retro, %{format: "Derps to action itemz!"})
    {format_error, _} = Keyword.fetch!(changeset.errors, :format)
    assert format_error == "is invalid"
  end

  test "fallback to the 'Happy/Sad/Confused' format when format not supplied" do
    retro = %Retro{facilitator_id: 1}
    %Ecto.Changeset{data: retro} = Retro.changeset(retro, %{format: nil})
    assert retro.format == "Happy/Sad/Confused"
  end

  test "the required presence of a facilitator_id" do
    changeset = Retro.changeset(%Retro{}, %{stage: "closed"})
    {facilitator_id_error, _} = Keyword.fetch!(changeset.errors, :facilitator_id)

    assert facilitator_id_error == "can't be blank"
  end

  describe "JSON encoding of the model struct" do
    test "is enabled" do
      retro = %Retro{
        id: 5,
        stage: "idea-generation",
        ideas: [],
        votes: [],
        users: [],
        groups: [],
        participations: [],
      }

      encoded = Jason.encode!(retro)

      assert encoded =~ ~r/"id":5/i
      assert encoded =~ ~r/"stage":"idea-generation"/i
    end
  end
end
