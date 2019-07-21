defmodule GroupingStageTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  import ShorterMaps
  describe "ideas in the grouping stage" do
    setup [:persist_idea_for_retro]

    @tag [
      retro_stage: "grouping",
      idea: %Idea{category: "sad", body: "splinters in the codebase", x: 105.5, y: 100.1},
    ]

    test "appear on the interface with coordinates mapped to transforms", ~M{retro, session} do
      retro_path = "/retros/" <> retro.id
      session = visit(session, retro_path)

      idea_inline_style =
        find(session, Query.css("p", text: "splinters in the codebase"))
        |> Wallaby.Element.attr("style")

      assert idea_inline_style =~ "transform: translate(105.5px, 100.1px)"
    end
  end
end
