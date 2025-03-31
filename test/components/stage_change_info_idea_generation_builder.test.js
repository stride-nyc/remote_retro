import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import stageChangeInfoIdeaGenerationBuilder from "../../web/static/js/components/stage_change_info_idea_generation_builder" // eslint-disable-line line-length

describe("stageChangeInfoIdeaGenerationBuilder", () => {
  test("returns a renderable React component with list", () => {
    const Result = stageChangeInfoIdeaGenerationBuilder([])
    render(<Result />)

    expect(screen.getByRole("list")).toBeInTheDocument()
  })

  describe("and there are no ideas given to the builder", () => {
    test("renders no list items", () => {
      const Result = stageChangeInfoIdeaGenerationBuilder([])
      render(<Result />)

      const listItems = screen.queryAllByRole("listitem")
      expect(listItems).toHaveLength(0)
    })
  })

  describe("and several ideas are given to the builder", () => {
    test("renders list items for each idea", () => {
      const ideas = ["hey", "howdy", "who"]

      const Result = stageChangeInfoIdeaGenerationBuilder(ideas)
      render(<Result />)

      const listItems = screen.getAllByRole("listitem")
      expect(listItems).toHaveLength(3)

      // Verify the content of each list item
      expect(listItems[0]).toHaveTextContent("hey")
      expect(listItems[1]).toHaveTextContent("howdy")
      expect(listItems[2]).toHaveTextContent("who")
    })
  })
})
