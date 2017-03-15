defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL

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
    |> find(Query.css(".sad.ideas", text: body), fn(item) ->
      item
      |> click(Query.button("x"))
    end)

    session
  end
end
