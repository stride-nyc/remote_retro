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

  test "vote count of six fails" do
    changeset = Participation.changeset(%Participation{}, %{vote_count: 6})
    { error, _ } = Keyword.fetch!(changeset.errors, :vote_count)
    assert error == "is invalid"
  end

  test "vote count of -1 fails" do
    changeset = Participation.changeset(%Participation{}, %{vote_count: -1})
    { error, _ } = Keyword.fetch!(changeset.errors, :vote_count)
    assert error == "is invalid"
  end

  test "vote count of 1 is valid" do
    changeset = Participation.changeset(%Participation{}, %{vote_count: 1})
    refute Keyword.has_key?(changeset.errors, :vote_count)
  end

  test "vote count of 5 is valid" do
    changeset = Participation.changeset(%Participation{}, %{vote_count: 5})
    refute Keyword.has_key?(changeset.errors, :vote_count)
  end
end
