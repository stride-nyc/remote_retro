defmodule GroupingStageTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.Idea

  import ShorterMaps
  describe "ideas in the grouping stage" do
    setup [:persist_ideas_for_retro]

    @tag [
      retro_stage: "grouping",
      ideas: [%Idea{category: "sad", body: "splinters in the codebase", x: 105.5, y: 100.1}],
    ]

    test "appear on the interface with coordinates mapped to transforms", ~M{retro, session} do
      retro_path = "/retros/" <> retro.id
      session = visit(session, retro_path)

      idea_coordinates = parse_transform_coordinates_for_card(session, "splinters in the codebase")

      assert %{"x" => "105.5", "y" => "100.1"} = idea_coordinates
    end

    @tag [
      retro_stage: "grouping",
      ideas: [%Idea{category: "sad", body: "rampant sickness", x: 80.5, y: 300.3}],
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

    @tag [
      retro_stage: "grouping",
      ideas: [
        %Idea{category: "sad", body: "rampant sickness", x: 0.0, y: 200.0},
        %Idea{category: "sad", body: "getting sickness", x: 10.0, y: 210.0},
      ],
    ]
    test "ideas dynamically remove bolding when out of proximity", ~M{retro, session} do
      retro_path = "/retros/" <> retro.id
      session = visit(session, retro_path)

      session |> assert_count_of_emboldened_ideas_to_be(2)

      session |> drag_idea("rampant sickness", to_center_of: ".grouping-board")

      session |> assert_count_of_emboldened_ideas_to_be(0)
    end

    @tag [
      retro_stage: "grouping",
      ideas: [
        %Idea{category: "sad", body: "rampant sickness", x: 0.0, y: 200.0},
        %Idea{category: "sad", body: "getting sickness", x: 10.0, y: 210.0},
      ],
    ]
    test "ideas can be visible in contrast mode", ~M{retro, session} do
      retro_path = "/retros/" <> retro.id
      session = visit(session, retro_path)

      click(session, Query.css("button", text: "Turn High Contrast On"))

      assert_has(session, Query.xpath("//p[contains(@style, 'box-shadow: rgb(0, 0, 0)')]", count: 2))

      click(session, Query.css("button", text: "Turn High Contrast Off"))

      assert_has(session, Query.xpath("//p[contains(@style, 'box-shadow: rgb(0, 0, 0)')]", count: 0))
    end
  end

  defp parse_transform_coordinates_for_card(session, idea_text) do
    inline_style_string =
      find(session, Query.css("p", text: idea_text))
      |> Wallaby.Element.attr("style")

    ~r/transform: translate\((?<x>.*)px,\s?(?<y>.*)px\)/
      |> Regex.named_captures(inline_style_string)
  end

  defp assert_count_of_emboldened_ideas_to_be(session, count) do
    assert_has(session, Query.xpath("//p[contains(@style, 'box-shadow')]", count: count))
  end
end
