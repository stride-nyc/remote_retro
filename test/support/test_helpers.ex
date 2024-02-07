defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL
  alias RemoteRetro.{Repo, Idea, Vote, User, Group}

  import ShorterMaps

  @mock_google_user_info Application.get_env(:remote_retro, :mock_google_user_info)

  def persist_test_user(attribute_overrides \\ %{}) do
    unique_integer = System.unique_integer()
    email = "user-#{unique_integer}@stride.build"
    name = "Test User #{unique_integer}"

    oauth_info =
      @mock_google_user_info
      |> Map.merge(%{"email" => email, "name" => name})
      |> Map.merge(attribute_overrides)

    {:ok, user, _} = User.upsert_record_from(oauth_info: oauth_info)
    user
  end

  def persist_ideas_for_retro(~M{ideas} = context) do
    ideas = Enum.map(ideas, fn idea ->
      context = Map.put(context, :idea, idea)
      context = persist_idea_for_retro(context)
      context[:idea]
    end)

    Map.put(context, :ideas, ideas)
  end

  def persist_idea_for_retro(~M{idea, retro, facilitator} = context) do
    idea_author = Map.get(context, context[:idea_author] || :facilitator)

    idea =
      case idea.category == "action-item" do
        true -> persist_idea(idea_author, idea, retro, assignee_id: facilitator.id)
        false -> persist_idea(idea_author, idea, retro)
      end

    Map.put(context, :idea, idea)
  end

  def persist_idea_for_retro(~M{retro} = context) do
    idea_author = Map.get(context, context[:idea_author] || :facilitator)

    idea =
      persist_idea(
        idea_author,
        %Idea{category: "confused", body: "whether I am alive right now? Is this real?"},
        retro
      )

    Map.put(context, :idea, idea)
  end

  defp persist_idea(user, idea, retro, options \\ [assignee_id: nil]) do
    %Idea{
      idea |
      assignee_id: options[:assignee_id],
      retro_id: retro.id,
      user_id: user.id,
    }
    |> Repo.insert!()
  end

  def persist_group_for_retro(context) do
    {:ok, group} = %Group{} |> RemoteRetro.Repo.insert()

    Map.merge(context, ~M{group})
  end

  def add_idea_to_group(~M{idea, group} = context) do
    idea =
      Idea
      |> Repo.get!(idea.id)
      |> Idea.changeset(%{ group_id: group.id })
      |> Repo.update!(returning: true)

    Map.put(context, :idea, idea)
  end

  def persist_a_vote(%{idea: idea, non_facilitator: non_facilitator} = context) do
    vote =
      %Vote{idea_id: idea.id, user_id: non_facilitator.id}
      |> Vote.changeset()
      |> Repo.insert!()

    Map.put(context, :vote, vote)
  end

  def new_authenticated_browser_session(user, metadata \\ %{}) do
    :timer.sleep(50)
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    authenticate(session, user)
  end

  def visit_retro(session, retro) do
    retro_path = "/retros/" <> retro.id
    visit(session, retro_path)
  end

  def update_idea_fields_to(session, category: category, text: text) do
    session |> find(Query.css(".edit.icon")) |> Element.click()
    fill_in(session, Query.text_field("editable_idea"), with: text)
    session |> find(Query.css(".idea-edit-form")) |> click(Query.option(category))
  end

  def save_idea_updates(session) do
    enabled_save_button_query = Query.css("button:not(:disabled)", text: "Save")

    session
    |> assert_has(enabled_save_button_query)
    |> find(enabled_save_button_query)
    |> Element.click()
  end

  def click_and_confirm_progression_to(facilitator_session, button_text) do
    assert_has(facilitator_session, Query.button(button_text))

    facilitator_session |> find(Query.button(button_text)) |> Element.click()
    facilitator_session |> find(Query.button("Yes")) |> Element.click()
  end

  def authenticate(session, user) do
    visit(session, "/auth/google/callback?code=#{user.email}&test_override=true")
  end

  def submit_action_item(session, ~M{assignee_name, body}) do
    submit_idea(session, ~M{select_option: assignee_name, body})
  end

  def submit_idea(session, ~M{category, body}) do
    submit_idea(session, ~M{select_option: category, body})
  end

  def submit_idea(session, ~M{select_option, body}) do
    assert_has(session, Query.css("form"))

    session
    |> find(Query.css("form.idea-submission"))
    |> click(Query.option(select_option))
    |> fill_in(Query.text_field("idea"), with: body)
    |> click(Query.button("Submit"))

    session
  end

  def delete_idea(session, ~M{body}) do
    session
    |> stub_js_confirms
    |> find(Query.css(".ideas li", text: body))
    |> click(Query.css(".remove.icon"))
  end

  def drag_idea(session, idea_text, from: from, to: to) do
    execute_script(session,
      """
      var allDraggableIdeas = Array.from(
        document.querySelectorAll("#{from} div[draggable=true]")
      );

      var draggableIdea = allDraggableIdeas.find(idea => idea.innerText === "#{idea_text}");

      var droppable = document.querySelector("#{to}");

      #{define_simulate_drag_and_drop_convenience_method()}

      simulateDragAndDrop(draggableIdea, droppable);
      """
    )
  end

  def drag_idea(session, idea_text, to_center_of: droppable_selector) do
    execute_script(session,
      """
      #{define_simulate_drag_and_drop_convenience_method()}

      var allDraggableIdeas = Array.from(
        document.querySelectorAll(".idea-card[draggable=true]")
      );

      var draggableIdea = allDraggableIdeas.find(idea => idea.innerText === "#{idea_text}");

      var droppable = document.querySelector("#{droppable_selector}");

      simulateDragAndDrop(draggableIdea, droppable);
      """
    )
  end

  defp stub_js_confirms(session) do
    execute_script(session, "window.confirm = function(){ return true; }")
  end

  defp define_simulate_drag_and_drop_convenience_method do
    """
    var simulateDragAndDrop = function (elemDrag, elemDrop) {
      // function for triggering mouse events
      var fireMouseEvent = function (type, elem, centerX, centerY) {

        var evt
        if (type.startsWith("drag")) {
          evt = new DragEvent(type, { dataTransfer: new DataTransfer({types: []})})
        } else {
          evt = document.createEvent('MouseEvents');
        }

        evt.initMouseEvent(type, true, true, window, 1, 1, 1, centerX, centerY, false, false, false, false, 0, elem);
        elem.dispatchEvent(evt);
      };

      if (!elemDrag || !elemDrop) return false;

      // calculate positions
      var pos = elemDrag.getBoundingClientRect();
      var center1X = Math.floor((pos.left + pos.right) / 2);
      var center1Y = Math.floor((pos.top + pos.bottom) / 2);
      pos = elemDrop.getBoundingClientRect();
      var center2X = Math.floor((pos.left + pos.right) / 2);
      var center2Y = Math.floor((pos.top + pos.bottom) / 2);

      // mouse over dragged element and mousedown
      fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
      fireMouseEvent('mouseenter', elemDrag, center1X, center1Y);
      fireMouseEvent('mouseover', elemDrag, center1X, center1Y);
      fireMouseEvent('mousedown', elemDrag, center1X, center1Y);


      // start dragging process over to drop target
      fireMouseEvent('dragstart', elemDrag, center1X, center1Y);
      fireMouseEvent('drag', elemDrag, center1X, center1Y);
      fireMouseEvent('mousemove', elemDrag, center1X, center1Y);
      fireMouseEvent('drag', elemDrag, center2X, center2Y);
      fireMouseEvent('mousemove', elemDrop, center2X, center2Y);

      // trigger dragging process on top of drop target
      fireMouseEvent('mouseenter', elemDrop, center2X, center2Y);
      fireMouseEvent('dragenter', elemDrop, center2X, center2Y);
      fireMouseEvent('mouseover', elemDrop, center2X, center2Y);
      fireMouseEvent('dragover', elemDrop, center2X, center2Y);

      // release dragged element on top of drop target
      fireMouseEvent('drop', elemDrop, center2X, center2Y);
      fireMouseEvent('dragend', elemDrag, center2X, center2Y);
      fireMouseEvent('mouseup', elemDrag, center2X, center2Y);

      return true;
    };
    """
  end
end
