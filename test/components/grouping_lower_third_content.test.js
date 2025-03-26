import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import GroupingLowerThirdContent from "../../web/static/js/components/grouping_lower_third_content"

// Mock the StageProgressionButton component
jest.mock("../../web/static/js/components/stage_progression_button", () => {
  return function MockStageProgressionButton() {
    return <div data-testid="stage-progression-button" />
  }
})

// Mock the HighContrastButton component
jest.mock("../../web/static/js/components/high_contrast_button", () => {
  return function MockHighContrastButton() {
    return <div data-testid="high-contrast-button" />
  }
})

describe("GroupingLowerThirdContent", () => {
  const defaultProps = {
    currentUser: {},
    children: <p>foo</p>,
    actions: {},
    stageConfig: { progressionButton: {} },
    userOptions: { highContrastOn: false },
  }

  test("renders a means of toggling high contrast", () => {
    render(<GroupingLowerThirdContent {...defaultProps} />)
    expect(screen.getByTestId("high-contrast-button")).toBeInTheDocument()
  })

  describe("when the user is the facilitator", () => {
    beforeEach(() => {
      const currentUser = { is_facilitator: true }
      render(
        <GroupingLowerThirdContent
          {...defaultProps}
          currentUser={currentUser}
        />
      )
    })

    test("renders the a means of progressing the stage", () => {
      expect(screen.getByTestId("stage-progression-button")).toBeInTheDocument()
    })

    test("does not render an extraneous div used for centering desktop content", () => {
      // In RTL, we query for elements that should NOT exist
      const emptyDivs = screen.queryAllByRole("generic").filter(div => {
        return div.classList.contains("three")
          && div.classList.contains("wide")
          && div.classList.contains("column")
          && div.classList.contains("ui")
          && div.classList.contains("computer")
          && div.classList.contains("tablet")
          && div.classList.contains("only")
          && div.textContent === ""
      })
      expect(emptyDivs.length).toBe(0)
    })
  })

  describe("when the user is not the facilitator", () => {
    beforeEach(() => {
      const currentUser = { is_facilitator: false }
      render(
        <GroupingLowerThirdContent
          {...defaultProps}
          currentUser={currentUser}
        />
      )
    })

    test("does not render a means of progressing the stage button", () => {
      expect(screen.queryByTestId("stage-progression-button")).not.toBeInTheDocument()
    })

    test("renders an extraneous div used for centering desktop content", () => {
      const emptyDivs = screen.queryAllByRole("generic").filter(div => {
        return div.classList.contains("three")
          && div.classList.contains("wide")
          && div.classList.contains("column")
          && div.classList.contains("ui")
          && div.classList.contains("computer")
          && div.classList.contains("tablet")
          && div.classList.contains("only")
          && div.textContent === ""
      })
      expect(emptyDivs.length).toBe(1)
    })
  })
})
