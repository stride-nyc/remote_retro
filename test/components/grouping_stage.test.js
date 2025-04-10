import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"

import GroupingStage from "../../web/static/js/components/grouping_stage"

jest.mock("../../web/static/js/components/grouping_board", () => {
  return function MockGroupingBoard() {
    return <div data-testid="grouping-board" />
  }
})

jest.mock("../../web/static/js/components/lower_third", () => {
  return function MockLowerThird() {
    return <div data-testid="lower-third" />
  }
})

describe("GroupingStage component", () => {
  const defaultProps = {
    ideas: [],
    actions: {},
    currentUser: {},
    stage: "grouping",
    stageConfig: {},
    userOptions: {},
  }

  let originalScrollTo

  beforeEach(() => {
    originalScrollTo = window.scrollTo
    window.scrollTo = jest.fn()
  })

  afterEach(() => {
    window.scrollTo = originalScrollTo
  })

  describe("when the component instantiates", () => {
    test("ensures that the user is scrolled to the top of the window so that every client's initial grouping card coordinates are consistent", () => {
      render(
        <GroupingStage {...defaultProps} />
      )

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    })

    describe("when the component is updated", () => {
      test("does *not* scroll the window additional times, letting the user maintain their desired scroll level", () => {
        const { rerender } = render(
          <GroupingStage {...defaultProps} />
        )

        rerender(<GroupingStage {...defaultProps} currentUser={{ name: "Some Guy" }} />)

        expect(window.scrollTo).toHaveBeenCalledTimes(1)
      })
    })
  })
})
