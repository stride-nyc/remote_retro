import React from "react"
import { render, screen } from "@testing-library/react"

import {
  CategoryColumn,
  mapStateToProps,
  dropTargetSpec,
} from "../../web/static/js/components/category_column"
// import "@testing-library/jest-dom"

global.ASSET_DOMAIN = "http://localhost"

jest.mock("react-dnd", () => {
  return {
    DragSource: () => component => component,
    DropTarget: () => component => component,
    useDrag: () => [{}, () => {}],
    useDrop: () => [{}, () => {}],
    DndProvider: ({ children }) => children,
  }
})

jest.mock("react-dnd-html5-backend", () => ({}))

describe("CategoryColumn", () => {
  const defaultProps = {
    ideas: [],
    category: "action-item",
    votes: [],
    stage: "idea-generation",
    actions: {},
    connectDropTarget: jest.fn(el => el),
    draggedOver: false,
  }

  describe("component", () => {
    describe("when no categoryDisplayStringOverride is passed", () => {
      it("renders the raw category string in the column header", () => {
        render(<CategoryColumn {...defaultProps} />)

        expect(screen.getByText("action-item").innerHTML).toEqual("action-item")
      })
    })

    describe("when a categoryDisplayStringOverride *is* passed", () => {
      it("renders the override string in the column header", () => {
        render(
          <CategoryColumn
            {...defaultProps}
            categoryDisplayStringOverride="gobbledygook"
          />
        )

        expect(screen.getByText("gobbledygook").innerHTML).toEqual("gobbledygook")
      })
    })
  })

  describe("mapStateToProps", () => {
    describe("when every idea matches the column's category", () => {
      it("returns all matching ideas in the props", () => {
        const ideas = [
          { id: 1, body: "tests!", category: "happy" },
          { id: 2, body: "winter break!", category: "happy" },
        ]

        const resultingProps = mapStateToProps({ ideas }, { category: "happy" })
        expect(resultingProps.ideas).toEqual(ideas)
      })
    })

    describe("when an idea doesn't match the column's category", () => {
      it("excludes mismatched ideas from props", () => {
        const ideas = [
          { id: 1, body: "still no word on tests", category: "confused" },
          { id: 2, body: "fassssst build", category: "happy" },
        ]

        const resultingProps = mapStateToProps({ ideas }, { category: "happy" })
        expect(resultingProps.ideas).toEqual([
          { id: 2, body: "fassssst build", category: "happy" },
        ])
      })
    })
  })

  describe("dropTargetSpec", () => {
    describe("#drop", () => {
      let actions
      let mockDragMonitor
      let categoryColumnProps

      beforeEach(() => {
        mockDragMonitor = {
          getItem: () => ({
            draggedIdea: { id: 66, category: "confused" },
          }),
        }

        actions = { submitIdeaEditAsync: jest.fn() }
      })

      describe("when the column's category differs from draggedIdea's category", () => {
        beforeEach(() => {
          categoryColumnProps = { category: "sad", actions }
        })

        it("calls submitIdeaEditAsync with updated category", () => {
          dropTargetSpec.drop(categoryColumnProps, mockDragMonitor)
          expect(actions.submitIdeaEditAsync).toHaveBeenCalledWith({
            id: 66,
            category: "sad",
          })
        })
      })

      describe("when the draggedIdea has the same category as the column", () => {
        beforeEach(() => {
          categoryColumnProps = { category: "confused", actions }
        })

        it("does not call submitIdeaEditAsync", () => {
          dropTargetSpec.drop(categoryColumnProps, mockDragMonitor)
          expect(actions.submitIdeaEditAsync).not.toHaveBeenCalled()
        })
      })
    })
  })
})
