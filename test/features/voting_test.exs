defmodule VotingTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  import ShorterMaps

  describe "voting for an idea" do
    setup [:persist_idea_for_retro]

    @tag [
      retro_stage: "voting",
      idea: %Idea{category: "happy", body: "pacing well"},
    ]

    test "increments the idea's vote count across sessions", ~M{retro, session: session_one} do
      session_two = new_authenticated_browser_session()

      retro_path = "/retros/" <> retro.id
      session_one = visit(session_one, retro_path)
      session_two = visit(session_two, retro_path)

      session_one |> assert_vote_count_is(0)

      session_one |> find(Query.css(".happy.column .green.button")) |> Element.click

      session_one |> assert_vote_count_is(1)
      session_two |> assert_vote_count_is(1)
    end
  end

  defp assert_vote_count_is(session, vote_count) do
    body_text = session |> find(Query.css("body")) |> Element.text()
    assert body_text =~ ~r/vote\n#{vote_count}/i
  end
end
