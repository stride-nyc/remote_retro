defmodule VotingTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  @category "happy"

  describe "voting for an idea" do
    setup [:persist_idea_for_retro]

    @tag [
      retro_stage: "voting",
      idea: %Idea{category: @category, body: "pacing well"},
    ]
    test "incrementing/decrementing an idea's vote count across sessions",
         %{retro: retro, session: facilitator_session_one, facilitator: facilitator} do
      facilitator_session_two = new_authenticated_browser_session(facilitator)

      facilitator_session_one = visit_retro(facilitator_session_one, retro)
      facilitator_session_two = visit_retro(facilitator_session_two, retro)

      facilitator_session_one |> assert_vote_count_for_idea_is(0)

      plus_button_selector = Query.css(".#{@category}.column .plus.button")
      assert_has(facilitator_session_one, plus_button_selector)
      facilitator_session_one |> find(plus_button_selector) |> Element.click()

      facilitator_session_one |> assert_vote_count_for_idea_is(1)
      facilitator_session_two |> assert_vote_count_for_idea_is(1)

      minus_button_selector = Query.css(".#{@category}.column .minus.button")
      assert_has(facilitator_session_one, minus_button_selector)
      facilitator_session_one |> find(minus_button_selector) |> Element.click()

      facilitator_session_one |> assert_vote_count_for_idea_is(0)
      facilitator_session_two |> assert_vote_count_for_idea_is(0)
    end
  end

  describe "group labeling and voting" do
    setup [:persist_group_for_retro, :persist_idea_for_retro, :add_idea_to_group]

    @tag [
      retro_stage: "groups-labeling",
      idea: %Idea{category: @category, body: "Frequent Pairing"},
    ]
    test "facilitator broadcasting group 'label' changes to other clients",
         %{retro: retro, session: facilitator_session, non_facilitator: non_facilitator} do
      non_facilitator_session = new_authenticated_browser_session(non_facilitator)

      facilitator_session = visit_retro(facilitator_session, retro)
      non_facilitator_session = visit_retro(non_facilitator_session, retro)

      submit_group_label_change(facilitator_session, with: "Communication")

      assert_has(non_facilitator_session, Query.css(".readonly-group-label", text: "Communication"))
    end

    @tag [
      retro_stage: "groups-voting",
      idea: %Idea{category: @category, body: "Frequent Pairing"},
    ]
    test "incrementing a group's vote count across sessions",
         %{retro: retro, session: facilitator_session_one, facilitator: facilitator} do
      facilitator_session_two = new_authenticated_browser_session(facilitator)

      facilitator_session_one = visit_retro(facilitator_session_one, retro)
      facilitator_session_two = visit_retro(facilitator_session_two, retro)

      facilitator_session_one |> assert_vote_count_for_group_is(0)

      plus_button_selector = Query.css(".idea-group .plus.button")
      assert_has(facilitator_session_one, plus_button_selector)
      facilitator_session_one |> find(plus_button_selector) |> Element.click()

      facilitator_session_one |> assert_vote_count_for_group_is(1)
      facilitator_session_two |> assert_vote_count_for_group_is(1)
    end
  end

  defp assert_vote_count_for_idea_is(session, vote_count) do
    assert_has(session, Query.css(".#{@category}.column", text: "#{vote_count}"))
  end

  defp assert_vote_count_for_group_is(session, vote_count) do
    assert_has(session, Query.css(".idea-group", text: "#{vote_count}"))
  end

  defp submit_group_label_change(session, [with: text]) do
    group_input = Query.css(".idea-group input[type='text']")
    session |> fill_in(group_input, with: text)

    # group.label input values are submitted upon a 'blur' event, so we trigger with a click
    session |> click(Query.css("body"))
  end
end
