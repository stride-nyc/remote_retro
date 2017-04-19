defmodule RemoteRetro.UserTest do
  use RemoteRetro.ModelCase

  alias RemoteRetro.User

  @valid_attrs %{email: "some content", google_user_info: %{test: "one two"}, last_login: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
