defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL
  alias RemoteRetro.{Repo, User, Vote, Idea, Participation}

  def use_all_votes(%{user: user, idea: idea} = context) do
    now = DateTime.utc_now
    vote = [user_id: user.id, idea_id: idea.id, inserted_at: now, updated_at: now]
    Repo.insert_all(Vote, [vote, vote, vote])
    context
  end

  defp persist_user(user) do
    {:ok, user } = User.upsert_record_from(oauth_info: user)
    user
  end

  defp persist_participation_for_additional_users(users, retro) do
    Enum.each(users, fn(user) ->
      %Participation{retro_id: retro.id, user_id: user.id} |> Repo.insert!
    end)
  end

  def persist_additional_users_for_retro(%{additional_users: additional_users, retro: retro} = context) do
    persisted_users = Enum.map(additional_users, fn(u) -> persist_user(u) end)
    persist_participation_for_additional_users(persisted_users, retro)
    Map.put(context, :additional_users, persisted_users)
  end

  defp persist_idea(user, idea, retro, options \\ [assignee_id: nil]) do
    %Idea{
      assignee_id: options[:assignee_id],
      body: idea.body,
      category: idea.category,
      retro_id: retro.id,
      user_id: user.id
    } |> Repo.insert!
  end

  def persist_idea_for_retro(%{idea: idea, retro: retro, user: user} = context) do
    idea =
      case idea.category == "action-item" do
        true -> persist_idea(user, idea, retro, assignee_id: user.id)
        false -> persist_idea(user, idea, retro)
      end

    Map.put(context, :idea, idea)
  end

  def new_browser_session(metadata \\ %{}) do
    :timer.sleep(50)
    {:ok, session} = Wallaby.start_session(metadata: metadata)
    resize_window(session, 1000, 1000)
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
