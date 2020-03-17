defmodule RetroIdeaRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  import ShorterMaps

  test "the immediate appearance of other users' submitted ideas", ~M{retro, session: session_one, non_facilitator} do
    session_two = new_authenticated_browser_session(non_facilitator)

    session_one = visit_retro(session_one, retro)
    session_two = visit_retro(session_two, retro)

    ideas_list_text = session_one |> find(Query.css(".sad.column")) |> Element.text()
    refute ideas_list_text =~ "user stories lack clear business value"

    submit_idea(session_two, %{category: "sad", body: "user stories lack clear business value"})

    assert_has(session_one, Query.css(".sad.column", text: "user stories lack clear business value"))
  end

  describe "when an idea already exists in a retro" do
    setup [:persist_idea_for_retro]

    @tag [
      idea: %Idea{category: "sad", body: "no linter"},
      idea_author: :non_facilitator,
    ]
    test "the immediate update of ideas as they are changed/saved",
         ~M{retro, session: facilitator_session, non_facilitator} do
      participant_session = new_authenticated_browser_session(non_facilitator)

      facilitator_session = visit_retro(facilitator_session, retro)
      participant_session = visit_retro(participant_session, retro)

      facilitator_session |> update_idea_fields_to(category: "confused", text: "No one uses the linter.")

      # assert other client sees immediate, unpersisted updates
      ideas_list_text = participant_session |> find(Query.css(".sad .ideas")) |> Element.text()
      assert ideas_list_text =~ ~r/No one uses the linter\.$/

      facilitator_session |> save_idea_updates

      # assert other client sees update
      assert_has(participant_session, Query.css(".confused .ideas", text: "No one uses the linter."))
    end

    @tag [
      idea: %Idea{category: "happy", body: "slack time!"},
    ]
    test "the immediate removal of an idea deleted by the facilitator",
         ~M{retro, session: facilitator_session, non_facilitator} do
      participant_session = new_authenticated_browser_session(non_facilitator)

      facilitator_session = visit_retro(facilitator_session, retro)
      participant_session = visit_retro(participant_session, retro)

      assert_has(participant_session, Query.css(".happy .ideas li", text: "slack time!"))

      delete_idea(facilitator_session, %{category: "happy", body: "slack time!"})

      assert_has(participant_session, Query.css(".happy.ideas li", count: 0))
    end
  end

  describe "when an action item has been assigned to a particular user" do
    setup [:persist_idea_for_retro]

    @tag [
      retro_stage: "action-items",
      idea: %Idea{body: "blurgh", category: "action-item"},
    ]

    test "it can be re-assigned to a different user",
         ~M{retro, facilitator, session: facilitator_session, non_facilitator} do
      participant_session = new_authenticated_browser_session(non_facilitator)

      facilitator_session = visit_retro(facilitator_session, retro)
      # need the second user to enter the retro so that they're a valid assignee
      visit_retro(participant_session, retro)

      action_items_list_text = facilitator_session |> find(Query.css(".action-item.column")) |> Element.text()
      assert action_items_list_text =~ "blurgh (#{facilitator.name})"

      facilitator_session
      |> click(Query.css(".edit"))
      |> find(Query.css(".idea-edit-form"))
      |> click(Query.option(non_facilitator.name))
      |> click(Query.button("Save"))

      assert_has(facilitator_session, Query.css(".action-item.column", text: "blurgh (#{non_facilitator.name})"))
    end
  end
end
