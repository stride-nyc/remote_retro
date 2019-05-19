defmodule PreExistingRetroStateRenderedOnJoiningRetroTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Data.{Idea}

  import ShorterMaps

  test "the rendering of ideas submitted prior to the user joining", ~M{session, retro, facilitator} do
    Repo.insert!(%Idea{category: "happy", body: "continuous delivery!", retro_id: retro.id, user_id: facilitator.id})

    retro_path = "/retros/" <> retro.id
    session = visit(session, retro_path)

    rendered_idea_text = session |> find(Query.css(".happy.ideas li")) |> Element.text()

    assert rendered_idea_text =~ "continuous delivery!"
  end
end
