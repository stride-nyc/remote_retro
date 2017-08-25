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

  test "vote count must be less than six" do
    changeset = Participation.changeset(%Participation{}, %{vote_count: 6})
    { error, _ } = Keyword.fetch!(changeset.errors, :vote_count)
    assert error == "is invalid"
  end

  test "vote count must be 0 or greater" do
    changeset = Participation.changeset(%Participation{}, %{vote_count: -1})
    { error, _ } = Keyword.fetch!(changeset.errors, :vote_count)
    assert error == "is invalid"
  end
end
