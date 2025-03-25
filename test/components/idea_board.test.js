import React from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import IdeaBoard from "../../web/static/js/components/idea_board"
import ColumnarBoardLayout from "../../web/static/js/components/columnar_board_layout"
import STAGES from "../../web/static/js/configs/stages"
import { renderWithRedux } from "../support/js/jest_test_helper"

const { IDEA_GENERATION, ACTION_ITEMS, CLOSED } = STAGES

// Mock the ColumnarBoardLayout component to check props
jest.mock("../../web/static/js/components/columnar_board_layout", () => jest.fn(() => <div data-testid="columnar-board-layout">Columnar Board Layout</div>))

describe("IdeaBoard component", () => {
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    ideas: [],
    stage: IDEA_GENERATION,
    isTabletOrAbove: true,
    ideaGenerationCategories: ["one", "two", "three"],
  }

  beforeEach(() => {
    // Clear mock data between tests
    ColumnarBoardLayout.mockClear()
  })

  describe("when the stage is 'idea-generation'", () => {
    it("passes the given idea generation categories to its layout component", () => {
      renderWithRedux(<IdeaBoard {...defaultProps} stage={IDEA_GENERATION} />)

      // Check that the component rendered
      expect(screen.getByTestId("columnar-board-layout")).toBeInTheDocument()

      // Check the categories prop passed to ColumnarBoardLayout
      expect(ColumnarBoardLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: ["one", "two", "three"],
        }),
        expect.anything()
      )
    })
  })

  describe("when the stage is 'action-items'", () => {
    it("passes an additional fourth category of action-items", () => {
      renderWithRedux(<IdeaBoard {...defaultProps} stage={ACTION_ITEMS} />)

      // Check the categories prop passed to ColumnarBoardLayout
      expect(ColumnarBoardLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: ["one", "two", "three", "action-item"],
        }),
        expect.anything()
      )
    })
  })

  describe("when the stage is 'closed'", () => {
    it("passes an additional fourth category of action-items", () => {
      renderWithRedux(<IdeaBoard {...defaultProps} stage={CLOSED} />)

      // Check the categories prop passed to ColumnarBoardLayout
      expect(ColumnarBoardLayout).toHaveBeenCalledWith(
        expect.objectContaining({
          categories: ["one", "two", "three", "action-item"],
        }),
        expect.anything()
      )
    })
  })
})
