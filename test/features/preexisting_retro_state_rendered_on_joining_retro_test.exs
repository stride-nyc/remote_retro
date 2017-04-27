defmodule PreExistingRetroStateRenderedOnJoiningRetroTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.{Idea, Retro}

  test "the rendering of ideas submitted prior to the user joining", %{session: session, retro: retro} do
    Repo.insert!(%Idea{ category: "happy", body: "continuous delivery!", retro_id: retro.id, author: "Travis" })

    retro_path = "/retros/" <> retro.id
    session = visit(session, retro_path)

    ideas_list_text = session |> find(Query.css(".happy.ideas")) |> Element.text

    assert String.contains?(ideas_list_text, "Travis: continuous delivery!")
  end

  describe "when a retro has already progressed to the `action-items` stage" do
    test "new visitors see the action item interface", %{session: session} do
      retro = Repo.insert!(%Retro{stage: "action-items"})
      Repo.insert!(%Idea{category: "action-item", body: "set up CI", retro_id: retro.id, author: "Travis"})

      retro_path = "/retros/" <> retro.id
      session = visit(session, retro_path)

      assert session |> find(Query.css(".action-item.ideas"))
    end
  end
end
