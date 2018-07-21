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

      # session one submits a vote for a particular idea
      # assert that the idea's vote count increments
      session_one |> find(Query.css("button.ui.green.button")) |> Element.click

      session_one_ideas_list_text = session_one |> find(Query.css(".happy.column")) |> Element.text()
      assert session_one_ideas_list_text =~ ~r/Vote\n1/ui

      session_two_ideas_list_text = session_two |> find(Query.css(".happy.column")) |> Element.text()
      assert session_two_ideas_list_text =~ ~r/Vote\n1/ui
    end
  end
end
