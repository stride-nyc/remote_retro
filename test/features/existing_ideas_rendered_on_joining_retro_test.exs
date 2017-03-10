defmodule ExistingIdeasRenderedOnJoiningRetroTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  test "the rendering of ideas submitted prior to the user joining", %{session: session, retro: retro} do
    Repo.insert!(%Idea{ category: "happy", body: "continuous delivery!", retro_id: retro.id })

    retro_path = "/retros/" <> retro.id
    session = visit(session, retro_path)

    ideas_list_text = session |> find(Query.css(".happy.ideas")) |> Element.text

    assert String.contains?(ideas_list_text, "continuous delivery!")
  end
end
