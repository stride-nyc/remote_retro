defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL
  alias RemoteRetro.{Repo, User, Vote, Idea, Participation}
  require IEx

  def use_all_votes(%{user: user, idea: idea} = context) do
    now = DateTime.utc_now
    vote = [user_id: user.id, idea_id: idea.id, inserted_at: now, updated_at: now]
    Repo.insert_all(Vote, [vote, vote, vote, vote, vote])
    context
  end

  defp user_name_atom(name) do
    String.replace(name, ~r/ +/, "") |> Macro.underscore |> String.to_atom
  end

  defp user_map(users) do
    Enum.reduce users, %{}, fn user, acc ->
      Map.put(acc, user_name_atom(user.name), user)
    end
  end

  defp persist_user(user) do
    user_params = User.build_user_from_oauth(user)
    user = User.changeset(%User{}, user_params)
        |> Repo.insert
  end

  def persist_users_for_retro(%{users: users} = context) do
    Enum.each(users, fn user ->
      persist_user(user)
    end)
    persisted_users = User |> Repo.all 
    Map.merge(user_map(persisted_users), context)
  end

  defp persist_assigned_idea(user, idea, retro) do
    %Participation{retro_id: retro.id, user_id: user.id} |> Repo.insert!
    idea = %Idea{assignee_id: user.id, body: idea.body, category: idea.category, retro_id: retro.id, user_id: user.id} |> Repo.insert!
  end

  defp persist_unassigned_idea(user, idea, retro) do
    Map.merge(idea, %{retro_id: retro.id, user_id: user.id}) |>Repo.insert!
  end

  def persist_idea_for_retro(%{idea: idea, retro: retro} = context) do
    if Map.has_key?(context, :idea_assignee) do
      idea_assignee = context[:idea_assignee]
      user = context[user_name_atom(idea_assignee["name"])]
      idea = persist_assigned_idea(user, idea, retro)
      Map.put(context, :idea, idea)
    else
      user = List.first(context[:users])
      user = context[user_name_atom(user["name"])]
      idea = if idea.category == "action-item" do
              persist_assigned_idea(user, idea, retro)
            else
              persist_unassigned_idea(user, idea, retro)
            end
      Map.put(context, :idea, idea)
    end
  end

  def new_browser_session(metadata \\ %{}) do
    :timer.sleep(50)
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    resize_window(session, 1000, 1000)
  end

  def stub_js_confirms_for_phantomjs(session) do
    execute_script(session, "window.confirm = function(){ return true; }")
  end

  def click_and_confirm(facilitator_session, button_text) do
    facilitator_session |> find(Query.button(button_text)) |> Element.click
    facilitator_session |> find(Query.button("Yes")) |> Element.click
  end

  def authenticate(session) do
    visit(session, "/auth/google/callback?code=love")
  end

  def submit_idea(session, %{ category: category, body: body }) do
    session
    |> find(Query.css("form"))
    |> click(Query.option(category))
    |> fill_in(Query.text_field("idea"), with: body)
    |> click(Query.button("Submit"))

    session
  end

  def delete_idea(session, %{body: body}) do
    session
    |> find(Query.css(".ideas li", text: body))
    |> click(Query.css(".remove.icon"))
  end
end
