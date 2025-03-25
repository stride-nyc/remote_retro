import React from "react"
import { fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { TabularBoardLayout } from "../../web/static/js/components/tabular_board_layout"
import { renderWithRedux } from "../support/js/jest_test_helper"

global.ASSET_DOMAIN = "test-domain"

describe("TabularBoardLayout component", () => {
  const mockCategoryTabSelected = jest.fn()

  const defaultProps = {
    actions: {
      categoryTabSelected: mockCategoryTabSelected,
    },
    categories: ["happy", "sad", "confused"],
    ideas: [],
    votes: [],
    selectedCategoryTab: "happy",
    stage: "idea-generation",
    currentUser: {},
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when clicking the tab for a given category", () => {
    test("dispatches an action to the store, indicating category selection", () => {
      // Create a mock component with a div that we can test against
      const { container } = renderWithRedux(<TabularBoardLayout {...defaultProps} />)

      // Find the sad tab and click it
      const sadTab = container.querySelector(".sad.item")
      fireEvent.mouseDown(sadTab)

      // Verify the action was called with the correct category
      expect(mockCategoryTabSelected).toHaveBeenCalledWith("sad")
    })
  })
})
