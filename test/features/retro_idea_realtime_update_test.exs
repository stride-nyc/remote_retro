defmodule RetroIdeaRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  test "the immediate appearance of other users submitted' ideas", %{session: session_one, retro: retro} do
    {:ok, session_two} = Wallaby.start_session()

    retro_path = "/retros/" <> retro.id
    session_one = visit(session_one, retro_path) |> join_retro_as_user("McKenneth McTickles")
    session_two = visit(session_two, retro_path) |> join_retro_as_user("Travis Vander Hoop")

    ideas_list_text = session_one |> find(".sad.ideas", visible: false) |> text
    refute String.contains?(ideas_list_text, "user stories lack clear business value")

    submit_idea(session_two, %{ category: "sad", body: "user stories lack clear business value" })

    ideas_list_text = session_one |> find(".sad.ideas") |> text
    assert String.contains?(ideas_list_text, "user stories lack clear business value")

    Wallaby.end_session(session_one)
    Wallaby.end_session(session_two)
  end
end
