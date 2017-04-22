defmodule RemoteRetro.UserTest do
  use RemoteRetro.ModelCase

  alias RemoteRetro.User

  @valid_attrs %{
    email: "mistertestuser@gmail.com",
    google_user_info: %{test: "one two"},
    family_name: "Vander Hoop",
    given_name: "Travis",
    locale: "en",
    name: "Test User",
    picture: "https://lh6.googleusercontent.com/-cZI40d8YpIQ/AAAAAAAAAAI/AAAAAAAAABs/gmDI7LQ2Lo0/photo.jpg?sz=50",
    profile: "https://plus.google.com/108658712426577966861",
    last_login: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}
  }
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
