defmodule LobbyRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: true

  test "the realtime updates of other users entering/leaving the room", %{session: session_one} do
    session_one
      |> visit("/")
      |> find("form")
      |> fill_in("username", with: "Todd Grundy")
      |> find("input[type='submit']")
      |> click

    user_list_text = session_one
      |> find("#user-list")
      |> text

    assert user_list_text == "Todd Grundy"

    metadata = Phoenix.Ecto.SQL.Sandbox.metadata_for(RemoteRetro.Repo, self())
    {:ok, session_two} = Wallaby.start_session(metadata: metadata)

    session_two
      |> visit("/")
      |> find("form")
      |> fill_in("username", with: "Martha Bernham")
      |> find("input[type='submit']")
      |> click

    user_list_text = session_one
      |> find("#user-list")
      |> text

    assert String.contains?(user_list_text, "Todd Grundy")
    assert String.contains?(user_list_text, "Martha Bernham")

    Wallaby.end_session(session_two)

    user_list_text = session_one
      |> find("#user-list")
      |> text

    refute String.contains?(user_list_text, "Martha Bernham")
  end
end
