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

      idea_coordinates = parse_transform_coordinates_for_card(session, "splinters in the codebase")

      assert %{"x" => "105.5", "y" => "100.1"} = idea_coordinates
    end

    @tag [
      retro_stage: "grouping",
      idea: %Idea{category: "sad", body: "rampant sickness", x: 80.5, y: 300.3},
    ]
    test "can be drag-and-dropped on one client and have their position update across all clients", ~M{retro, session, non_facilitator} do
      retro_path = "/retros/" <> retro.id
      session_one = visit(session, retro_path)

      session_two = new_authenticated_browser_session(non_facilitator)
      session_two = visit(session_two, retro_path)

      idea_coordinates_before =
        session_two
        |> parse_transform_coordinates_for_card("rampant sickness")

      drag_idea(session_one, "rampant sickness", to_center_of: ".grouping-board")

      idea_coordinates_after =
        session_two
        |> parse_transform_coordinates_for_card("rampant sickness")

      refute idea_coordinates_before == idea_coordinates_after
    end
  end

  defp parse_transform_coordinates_for_card(session, idea_text) do
    inline_style_string =
      find(session, Query.css("p", text: idea_text))
      |> Wallaby.Element.attr("style")

    ~r/transform: translate\((?<x>.*)px,\s?(?<y>.*)px\)/
      |> Regex.named_captures(inline_style_string)
  end
end
