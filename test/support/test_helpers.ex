defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL
  alias RemoteRetro.{Repo, Idea, Vote}

  import ShorterMaps

  defp persist_idea(user, idea, retro, options \\ [assignee_id: nil]) do
    %Idea{
      assignee_id: options[:assignee_id],
      body: idea.body,
      category: idea.category,
      retro_id: retro.id,
      user_id: user.id
    } |> Repo.insert!
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
      |> Vote.changeset
      |> Repo.insert!

    Map.put(context, :vote, vote)
  end

  def new_authenticated_browser_session(metadata \\ %{}) do
    :timer.sleep(100)
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    authenticate(session)
  end

  def click_and_confirm(facilitator_session, button_text) do
    facilitator_session |> find(Query.button(button_text)) |> Element.click
    facilitator_session |> find(Query.button("Yes")) |> Element.click
  end

  def authenticate(session) do
    visit(session, "/auth/google/callback?code=love")
  end

  def submit_idea(session, ~M{category, body}) do
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

  defp stub_js_confirms(session) do
    execute_script(session, "window.confirm = function(){ return true; }")
  end
end
