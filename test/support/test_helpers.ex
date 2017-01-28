defmodule RemoteRetro.TestHelpers do
  use Wallaby.DSL

  def join_retro_as_user(session, username) do
    session
    |> visit("/")
    |> find("form")
    |> fill_in("username", with: username)
    |> find("input[type='submit']")
    |> click
  end
end
