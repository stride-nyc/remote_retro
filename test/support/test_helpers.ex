defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL

  def join_retro_as_user(session, username) do
    session
    |> visit("/")
    |> find("form")
    |> fill_in("username", with: username)
    |> click_button("Submit")

    session
  end

  def submit_idea(session, idea) do
    session
    |> find("form")
    |> fill_in("idea", with: idea)
    |> click_button("Submit")

    session
  end
end
