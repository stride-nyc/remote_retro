defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL
  alias RemoteRetro.{Repo, User, Vote, Idea, Participation}
  require IEx

  @mock_user Application.get_env(:remote_retro, :mock_user)
  @other_user Application.get_env(:remote_retro, :other_user)

  def persist_idea_for_retro(context) do
    %{idea: idea, retro: retro, user: user} = context

    idea = if idea.category == "action-item" do
            Map.merge(idea, %{retro_id: retro.id, user_id: user.id, assignee_id: user.id})
            |>Repo.insert!
          else
            Map.merge(idea, %{retro_id: retro.id, user_id: user.id})
            |>Repo.insert!
          end

    Map.put(context, :idea, idea)
  end

  def use_all_votes(%{user: user, idea: idea} = context) do
    now = DateTime.utc_now
    vote = [user_id: user.id, idea_id: idea.id, inserted_at: now, updated_at: now]
    Repo.insert_all(Vote, [vote, vote, vote, vote, vote])
    context
  end

  def persist_user_for_retro(context) do
    context = Map.merge(%{user: @mock_user}, context)
    %{user: user} = context
    user_params = User.build_user_from_oauth(user)
    user =
      User.changeset(%User{}, user_params)
      |> Repo.insert!

    Map.put(context, :user, user)
  end

  def insert_into_context(context, user) do
    user_name_atom = String.replace(user.name, ~r/ +/, "") |> Macro.underscore |> String.to_atom
    Map.put(context, user_name_atom, user)
  end


  def persist_other_user_for_retro(context) do
    %{users: users} = context

    Enum.each(users, fn user ->
      # require Logger
      # Logger.error "#{user.name}"
      user_params = User.build_user_from_oauth(user)
      # user = 
      User.changeset(%User{}, user_params)
        |> Repo.insert!
    end)

    users = User |> Repo.all
    test_user = Enum.at(users, 0)
    other_user = Enum.at(users, 1)

    context = insert_into_context(context, test_user)
    context = insert_into_context(context, other_user)
    Apex.ap context
    # IEx.pry
  end

  def assign_idea(%{other_user: other_user, retro: retro} = context) do
    idea = %Idea{assignee_id: other_user.id, body: "blurgh", category: "action-item", retro_id: retro.id, user_id: other_user.id} |> Repo.insert!
    participation = %Participation{retro_id: retro.id, user_id: other_user.id} |> Repo.insert!
    Map.put(context, :idea, idea)
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
