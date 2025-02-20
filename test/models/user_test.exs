defmodule RemoteRetro.UserTest do
  use RemoteRetro.DataCase

  alias RemoteRetro.User

  @mock_google_user_info Application.compile_env(:remote_retro, :mock_google_user_info)

  @valid_attrs %{
    "email" => "mistertestuser@gmail.com",
    "google_user_info" => %{test: "one two"},
    "family_name" => "Vander Hoop",
    "given_name" => "Travis",
    "locale" => "en",
    "name" => "Test User",
    "picture" => "https://lh6.googleusercontent.com/-cZI40d8YpIQ/AAAAAAAAAAI/AAAAAAAAABs/gmDI7LQ2Lo0/photo.jpg?sz=50",
    "last_login" => ~N[2010-04-03 23:00:07],
  }
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "valid changeset when optional fields are absent" do
    attrs_minus_family_name = Map.drop(@valid_attrs, [:family_name])

    changeset = User.changeset(%User{}, attrs_minus_family_name)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "the valid inclusion of a virtual, unpersisted `online_at` attribute" do
    user = %User{email: "monsieur@misspellingsarefine.com"}
    assert %User{user | online_at: 393_939_393_939}
  end

  test "the valid inclusion of a virtual, unpersisted `token` attribute" do
    user = %User{email: "monsieur@misspellingsarefine.com"}
    assert %User{user | token: "abc987zyx"}
  end

  describe "upsert_record_from/1" do
    test "persists a user in the db, flagging it as inserted" do
      assert {
               :ok,
               %User{id: _, last_login: _},
               :inserted
             } = User.upsert_record_from(oauth_info: @mock_google_user_info)
    end

    test "existing users are updated in the db, and flagged as updated" do
      User.upsert_record_from(oauth_info: @mock_google_user_info)

      updated_google_info = Map.merge(@mock_google_user_info, %{"name" => "Named User"})

      {:ok, _user, :updated} = User.upsert_record_from(oauth_info: updated_google_info)
      user = Repo.get_by(User, email: @mock_google_user_info["email"])

      assert user.name == "Named User"
    end

    test "includes a last_login timestamp" do
      {:ok, user, _} = User.upsert_record_from(oauth_info: @mock_google_user_info)
      assert user.last_login
    end

    test "accounts lacking a given name receive a given name parsed from their email" do
      attrs_minus_given_name =
        @valid_attrs
        |> Map.drop(["given_name"])
        |> Map.merge(%{"email" => "tvhoop@hotmail.com"})

      {:ok, user, _} = User.upsert_record_from(oauth_info: attrs_minus_given_name)

      assert user.given_name == "tvhoop"
    end
  end
end
