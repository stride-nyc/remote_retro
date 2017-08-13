defmodule PreExistingRetroStateRenderedOnJoiningRetroTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.{Idea, Retro, User}

  test "the rendering of ideas submitted prior to the user joining", %{session: session, retro: retro} do
    user = Repo.get_by(User, email: "mistertestuser@gmail.com")
    Repo.insert!(%Idea{ category: "happy", body: "continuous delivery!", retro_id: retro.id, user_id: user.id})

    retro_path = "/retros/" <> retro.id
    session = visit(session, retro_path)

    rendered_idea_text = session |> find(Query.css(".happy.ideas li")) |> Element.text

    assert rendered_idea_text =~ "continuous delivery!"
  end

  describe "when a retro has already progressed to the `action-items` stage" do
    test "new visitors see the action item interface", %{session: session} do
      user = Repo.get_by(User, email: "mistertestuser@gmail.com")
      retro = Repo.insert!(%Retro{stage: "action-items"})
      Repo.insert!(%Idea{category: "action-item", body: "set up CI", retro_id: retro.id, user_id: user.id})

      retro_path = "/retros/" <> retro.id
      session = visit(session, retro_path)

      assert session |> find(Query.css(".action-item.ideas"))
    end
  end
end
