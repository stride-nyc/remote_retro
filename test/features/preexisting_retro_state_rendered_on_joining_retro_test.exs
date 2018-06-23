defmodule PreExistingRetroStateRenderedOnJoiningRetroTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.{Idea, User}

  import ShorterMaps

  test "the rendering of ideas submitted prior to the user joining", ~M{session, retro} do
    user = Repo.get_by(User, email: "mrtestuser@one.com")
    Repo.insert!(%Idea{ category: "happy", body: "continuous delivery!", retro_id: retro.id, user_id: user.id})

    retro_path = "/retros/" <> retro.id
    session = visit(session, retro_path)

    rendered_idea_text = session |> find(Query.css(".happy.ideas li")) |> Element.text

    assert rendered_idea_text =~ "continuous delivery!"
  end
end
