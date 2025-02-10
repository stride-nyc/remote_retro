defmodule CategoryChangeViaDragAndDrop do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  import ShorterMaps

  describe "when an idea already exists in a retro" do
    setup [:persist_idea_for_retro]

    @tag [
      idea: %Idea{category: "sad", body: "no linter"}
    ]
    test "users can drag the idea from one column to another", ~M{retro, session} do
      session = visit_retro(session, retro)

      assert_has(session, Query.css(".sad .ideas", text: "no linter"))

      session |> drag_idea("no linter", from: ".sad.column", to: ".confused.column")

      assert_has(session, Query.css(".confused.column", text: "no linter"))
    end
  end
end
