defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL

  def join_retro_as_user(session, username) do
    session
    |> find("form")
    |> fill_in("username", with: username)
    |> click_button("Submit")

    session
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
