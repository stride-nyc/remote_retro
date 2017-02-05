defmodule LobbyRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: true

  test "the realtime updates of other users entering/leaving the room", %{session: session_one} do
    retro_uuid = "8373-ahjk-333"

    visit(session_one, "/retros/" <> retro_uuid)
    |> join_retro_as_user("Todd Grundy")

    user_list_text = session_one |> find("#user-list") |> text
    assert user_list_text == "Todd Grundy"

    {:ok, session_two} = Wallaby.start_session()

    visit(session_two, "/retros/" <> retro_uuid)
    |> join_retro_as_user("Martha Bernham")

    user_list_text = session_one |> find("#user-list") |> text

    assert String.contains?(user_list_text, "Todd Grundy")
    assert String.contains?(user_list_text, "Martha Bernham")

    Wallaby.end_session(session_two)

    user_list_text = session_one |> find("#user-list") |> text

    refute String.contains?(user_list_text, "Martha Bernham")

    Wallaby.end_session(session_one)
  end
end
