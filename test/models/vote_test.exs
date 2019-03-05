defmodule RemoteRetro.VoteTest do
  use RemoteRetro.ModelCase, async: true

  alias RemoteRetro.Vote

  test "user_id and idea_id are required" do
    changeset = Vote.changeset(%Vote{})

    {user_id_error, _} = Keyword.fetch!(changeset.errors, :user_id)
    {idea_id_error, _} = Keyword.fetch!(changeset.errors, :idea_id)

    assert user_id_error == "can't be blank"
    assert idea_id_error == "can't be blank"
  end
end
