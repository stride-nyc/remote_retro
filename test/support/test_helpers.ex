defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL

  def authenticate(session) do
    visit(session, "/auth/google/callback?code=love")
  end

  def submit_idea(session, %{ category: category, body: body }) do
    session
    |> find("form")
    |> select("category", option: category)
    |> fill_in("idea", with: body)
    |> click_button("Submit")

    session
  end
end
