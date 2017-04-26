defmodule RemoteRetro.ParticipationTest do
  use RemoteRetro.ModelCase, async: true

  alias RemoteRetro.Participation

  test "user_id and retro_id are required" do
    changeset = Participation.changeset(%Participation{})

    { user_id_error, _ } = Keyword.fetch!(changeset.errors, :user_id)
    { retro_id_error, _ } = Keyword.fetch!(changeset.errors, :retro_id)

    assert user_id_error == "can't be blank"
    assert retro_id_error == "can't be blank"
  end
end
