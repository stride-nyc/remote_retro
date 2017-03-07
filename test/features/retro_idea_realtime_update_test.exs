defmodule RetroIdeaRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false

  test "deleting an idea from a list", %{session: session_one, retro: retro} do
    {:ok, session_two} = Wallaby.start_session()

    retro_path = "/retros/" <> retro.id
    session_one = authenticate(session_one) |> visit(retro_path)
    session_two = authenticate(session_two) |> visit(retro_path)

    idea = %{category: "sad", body: "user stories lack clear business value"}
    submit_idea(session_two, idea)

    delete_idea(session_two, idea)
    ideas_list_text = session_two |> find(Query.css(".sad.ideas", visible: false)) |> Element.text
    refute String.contains?(ideas_list_text, idea.body)

    Wallaby.end_session(session_one)
    Wallaby.end_session(session_two)
  end

  test "the immediate appearance of other users submitted' ideas", %{session: session_one, retro: retro} do
    {:ok, session_two} = Wallaby.start_session()

    retro_path = "/retros/" <> retro.id
    session_one = authenticate(session_one) |> visit(retro_path)
    session_two = authenticate(session_two) |> visit(retro_path)

    ideas_list_text = session_one |> find(Query.css(".sad.ideas", visible: false)) |> Element.text()
    refute String.contains?(ideas_list_text, "user stories lack clear business value")

    submit_idea(session_two, %{category: "sad", body: "user stories lack clear business value" })

    ideas_list_text = session_one |> find(Query.css(".sad.ideas")) |> Element.text
    assert String.contains?(ideas_list_text, "user stories lack clear business value")

    Wallaby.end_session(session_one)
    Wallaby.end_session(session_two)
  end
end
