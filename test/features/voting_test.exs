defmodule VotingTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  import ShorterMaps

  @category "happy"

  describe "voting for an idea" do
    setup [:persist_idea_for_retro]

    @tag [
      retro_stage: "voting",
      idea: %Idea{category: @category, body: "pacing well"},
    ]

    test "increments the idea's vote count across sessions", ~M{retro, session: session_one} do
      session_two = new_authenticated_browser_session()

      retro_path = "/retros/" <> retro.id
      session_one = visit(session_one, retro_path)
      session_two = visit(session_two, retro_path)

      session_one |> assert_vote_count_is(0)

      session_one |> find(Query.css(".#{@category}.column .green.button")) |> Element.click

      session_one |> assert_vote_count_is(1)
      session_two |> assert_vote_count_is(1)
    end

    @tag [
      retro_stage: "voting",
      idea: %Idea{category: @category, body: "pacing well"},
    ]
    test "incrementing/decrementing an idea's vote count across sessions", ~M{retro, session: session_one} do
      session_two = new_authenticated_browser_session()
      execute_script(session_one, "window.localStorage.setItem('subtractVoteDev', true)")
      execute_script(session_two, "window.localStorage.setItem('subtractVoteDev', true)")

      retro_path = "/retros/" <> retro.id
      session_one = visit(session_one, retro_path)
      session_two = visit(session_two, retro_path)

      session_one |> assert_vote_count_is(0)

      session_one |> find(Query.css(".#{@category}.column .plus.button")) |> Element.click

      session_one |> assert_vote_count_is(1)
      session_two |> assert_vote_count_is(1)

      session_one |> find(Query.css(".#{@category}.column .minus.button")) |> Element.click

      session_one |> assert_vote_count_is(0)
      session_two |> assert_vote_count_is(0)
    end
  end

  defp assert_vote_count_is(session, vote_count) do
    assert_has(session, Query.css(".#{@category}.column", text: "#{vote_count}"))
  end
end
