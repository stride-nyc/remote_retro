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
    test "incrementing/decrementing an idea's vote count across sessions", ~M{retro, session: facilitator_session_one, facilitator} do
      facilitator_session_two = new_authenticated_browser_session(facilitator)

      retro_path = "/retros/" <> retro.id
      facilitator_session_one = visit(facilitator_session_one, retro_path)
      facilitator_session_two = visit(facilitator_session_two, retro_path)

      facilitator_session_one |> assert_vote_count_is(0)

      facilitator_session_one |> find(Query.css(".#{@category}.column .plus.button")) |> Element.click

      facilitator_session_one |> assert_vote_count_is(1)
      facilitator_session_two |> assert_vote_count_is(1)

      facilitator_session_one |> find(Query.css(".#{@category}.column .minus.button")) |> Element.click

      facilitator_session_one |> assert_vote_count_is(0)
      facilitator_session_two |> assert_vote_count_is(0)
    end
  end

  defp assert_vote_count_is(session, vote_count) do
    assert_has(session, Query.css(".#{@category}.column", text: "#{vote_count}"))
  end
end
