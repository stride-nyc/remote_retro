defmodule RetroIdeaRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  # @tag :skip
  test "the immediate appearance of other users submitted' ideas" do
    {:ok, session_one} = Wallaby.start_session()
    {:ok, session_two} = Wallaby.start_session()
    retro_uuid = "93939-ag35kd"

    session_one = visit(session_one, "/retros/" <> retro_uuid)
    |> join_retro_as_user("McKenneth McTickles")

    session_two = visit(session_two, "/retros/" <> retro_uuid)
    |> join_retro_as_user("Travis Vander Hoop")

    ideas_list_text = session_one |> find(".sad.ideas", visible: false) |> text
    refute String.contains?(ideas_list_text, "user stories lack clear business value")

    submit_idea(session_two, %{ category: "sad", body: "user stories lack clear business value" })

    ideas_list_text = session_one |> find(".sad.ideas") |> text
    assert String.contains?(ideas_list_text, "user stories lack clear business value")

    Wallaby.end_session(session_one)
    Wallaby.end_session(session_two)
  end
end
