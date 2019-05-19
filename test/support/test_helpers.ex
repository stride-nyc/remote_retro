defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL
  alias RemoteRetro.{Repo, Data}
  alias Data.{Idea, Vote, User}

  import ShorterMaps

  @mock_google_user_info Application.get_env(:remote_retro, :mock_google_user_info)

  def persist_test_user(attribute_overrides \\ %{}) do
    unique_integer = System.unique_integer()
    email = "user-#{unique_integer}@stridenyc.com"
    name = "Test User #{unique_integer}"

    oauth_info =
      @mock_google_user_info
      |> Map.merge(%{"email" => email, "name" => name})
      |> Map.merge(attribute_overrides)

    {:ok, user, _} = User.upsert_record_from(oauth_info: oauth_info)
    user
  end

  defp persist_idea(user, idea, retro, options \\ [assignee_id: nil]) do
    %Idea{
      assignee_id: options[:assignee_id],
      body: idea.body,
      category: idea.category,
      retro_id: retro.id,
      user_id: user.id,
    }
    |> Repo.insert!()
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

  def persist_a_vote(%{idea: idea, non_facilitator: non_facilitator} = context) do
    vote =
      %Vote{idea_id: idea.id, user_id: non_facilitator.id}
      |> Vote.changeset()
      |> Repo.insert!()

    Map.put(context, :vote, vote)
  end

  def new_authenticated_browser_session(user, metadata \\ %{}) do
    :timer.sleep(100)
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    authenticate(session, user)
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

  def click_and_confirm(facilitator_session, button_text) do
    assert_has(facilitator_session, Query.button(button_text))

    facilitator_session |> find(Query.button(button_text)) |> Element.click()
    facilitator_session |> find(Query.button("Yes")) |> Element.click()
  end

  def authenticate(session, user) do
    visit(session, "/auth/google/callback?code=#{user.email}&test_override=true")
  end

  def submit_idea(session, ~M{category, body}) do
    assert_has(session, Query.css("form"))

    session
    |> find(Query.css("form"))
    |> click(Query.option(category))
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
        document.querySelectorAll(".#{from}.column div[draggable='true']")
      );

      var dragSource = allDraggableIdeas.find(idea => idea.innerText === "#{idea_text}");

      var dropTarget = document.querySelector(".#{to}.column");

      #{define_simulate_drag_and_drop_convenience_method()}

      simulateDragDrop(dragSource, dropTarget);
      """
    )
  end


  defp stub_js_confirms(session) do
    execute_script(session, "window.confirm = function(){ return true; }")
  end

  defp define_simulate_drag_and_drop_convenience_method do
    """
    function simulateDragDrop(sourceNode, destinationNode) {
        var EVENT_TYPES = {
            DRAG_END: 'dragend',
            DRAG_START: 'dragstart',
            DROP: 'drop'
        }

        function createCustomEvent(type) {
            var event = new CustomEvent("CustomEvent")
            event.initCustomEvent(type, true, true, null)
            event.dataTransfer = {
                data: {
                },
                setData: function(type, val) {
                    this.data[type] = val
                },
                getData: function(type) {
                    return this.data[type]
                },
                dropEffect: 'move',
                effectAllowed:'move',
                types: [],
                items:{},
                files:{},
            }
            return event
        }

        function dispatchEvent(node, type, event) {
            if (node.dispatchEvent) {
                return node.dispatchEvent(event)
            }
            if (node.fireEvent) {
                return node.fireEvent("on" + type, event)
            }
        }

        var event = createCustomEvent(EVENT_TYPES.DRAG_START)
        dispatchEvent(sourceNode, EVENT_TYPES.DRAG_START, event)

        var dropEvent = createCustomEvent(EVENT_TYPES.DROP)
        dropEvent.dataTransfer = event.dataTransfer
        dispatchEvent(destinationNode, EVENT_TYPES.DROP, dropEvent)

        var dragEndEvent = createCustomEvent(EVENT_TYPES.DRAG_END)
        dragEndEvent.dataTransfer = event.dataTransfer
        dispatchEvent(sourceNode, EVENT_TYPES.DRAG_END, dragEndEvent)
    }
    """
  end
end
