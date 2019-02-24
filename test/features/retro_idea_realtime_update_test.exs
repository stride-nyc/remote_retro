defmodule RetroIdeaRealtimeUpdateTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  import ShorterMaps

  test "the immediate appearance of other users' submitted ideas", ~M{retro, session: session_one, non_facilitator} do
    session_two = new_authenticated_browser_session(non_facilitator)

    retro_path = "/retros/" <> retro.id
    session_one = visit(session_one, retro_path)
    session_two = visit(session_two, retro_path)

    ideas_list_text = session_one |> find(Query.css(".sad.column")) |> Element.text()
    refute ideas_list_text =~ "user stories lack clear business value"

    submit_idea(session_two, %{category: "sad", body: "user stories lack clear business value" })

    ideas_list_text = session_one |> find(Query.css(".sad.column")) |> Element.text
    assert ideas_list_text =~ "user stories lack clear business value"
  end

  describe "when an idea already exists in a retro" do
    setup [:persist_idea_for_retro]

    @tag [
      idea: %Idea{category: "sad", body: "no linter"},
      idea_author: :non_facilitator
    ]
    test "the immediate update of ideas as they are changed/saved", ~M{retro, session: facilitator_session, non_facilitator} do
      participant_session = new_authenticated_browser_session(non_facilitator)

      retro_path = "/retros/" <> retro.id
      facilitator_session = visit(facilitator_session, retro_path)
      participant_session = visit(participant_session, retro_path)

      facilitator_session |> find(Query.css(".edit.icon")) |> Element.click
      fill_in(facilitator_session, Query.text_field("editable_idea"), with: "No one uses the linter.")
      facilitator_session |> find(Query.css(".idea-edit-form")) |> click(Query.option("confused"))

      # assert other client sees immediate, unpersisted updates
      ideas_list_text = participant_session |> find(Query.css(".sad.ideas")) |> Element.text
      assert ideas_list_text =~ ~r/No one uses the linter\.$/

      facilitator_session |> find(Query.button("Save")) |> Element.click

      # assert other client sees persistence indicator
      assert_has(participant_session, Query.css(".confused.ideas", text: "No one uses the linter. (edited)"))
    end

    @tag [
      idea: %Idea{category: "happy", body: "slack time!"},
    ]
    test "the immediate removal of an idea deleted by the facilitator", ~M{retro, session: facilitator_session, non_facilitator} do
      participant_session = new_authenticated_browser_session(non_facilitator)

      retro_path = "/retros/" <> retro.id
      facilitator_session = visit(facilitator_session, retro_path)
      participant_session = visit(participant_session, retro_path)

      ideas_list_text = participant_session |> find(Query.css(".happy.ideas li")) |> Element.text
      assert ideas_list_text =~ ~r/slack time/

      delete_idea(facilitator_session, %{category: "happy", body: "slack time!"})

      assert find(participant_session, Query.css(".happy.ideas li", count: 0))
    end
  end

  describe "when an action item has been assigned to a particular user" do
    setup [:persist_idea_for_retro]

    @tag [
      retro_stage: "action-items",
      idea: %Idea{body: "blurgh", category: "action-item"},
    ]

    test "it can be re-assigned to a different user", ~M{retro, facilitator, session: facilitator_session, non_facilitator} do
      participant_session = new_authenticated_browser_session(non_facilitator)

      retro_path = "/retros/" <> retro.id
      facilitator_session = visit(facilitator_session, retro_path)
      visit(participant_session, retro_path) # need the second user to enter the retro so that they're a valid assignee

      action_items_list_text = facilitator_session |> find(Query.css(".action-item.column")) |> Element.text()
      assert action_items_list_text =~ "blurgh (#{facilitator.name})"

      facilitator_session
      |> click(Query.css(".edit"))
      |> find(Query.css(".idea-edit-form"))
      |> click(Query.option(non_facilitator.name))
      |> click(Query.button("Save"))

      action_items_list_text = facilitator_session |> find(Query.css(".action-item.column")) |> Element.text()
      assert action_items_list_text =~ "blurgh (#{non_facilitator.name})"
    end
  end
end
