import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { DndContext } from "@dnd-kit/core"

import ColumnarBoardLayout from "../../web/static/js/components/columnar_board_layout"
import CategoryColumn from "../../web/static/js/components/category_column"

jest.mock("@dnd-kit/core", () => ({
  DndContext: jest.fn(({ children }) => <div data-testid="dnd-context">{children}</div>),
  DragOverlay: jest.fn(({ children }) => <div data-testid="drag-overlay">{children}</div>),
}))

jest.mock("../../web/static/js/components/category_column", () => {
  return jest.fn(props => (
    <div data-testid={`category-column-${props.category}`}>
      Category: {props.category}
    </div>
  ))
})

jest.mock("../../web/static/js/components/idea_content_base", () => {
  return jest.fn(props => (
    <div data-testid="idea-content-base">
      {props.idea ? `Idea: ${props.idea.body}` : "No active idea"}
    </div>
  ))
})

describe("<ColumnarBoardLayout />", () => {
  const defaultProps = {
    categories: ["happy", "sad", "confused"],
    ideas: [
      { id: 1, body: "Idea 1", category: "happy" },
      { id: 2, body: "Idea 2", category: "sad" },
      { id: 3, body: "Idea 3", category: "confused" },
    ],
    currentUser: { id: 1, name: "Test User" },
    stage: "idea-generation",
    actions: {
      submitIdeaEditAsync: jest.fn(),
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("renders a DndContext component", () => {
    render(<ColumnarBoardLayout {...defaultProps} />)
    expect(screen.getByTestId("dnd-context")).toBeInTheDocument()
  })

  test("renders a CategoryColumn for each category", () => {
    render(<ColumnarBoardLayout {...defaultProps} />)

    expect(screen.getByTestId("category-column-happy")).toBeInTheDocument()
    expect(screen.getByTestId("category-column-sad")).toBeInTheDocument()
    expect(screen.getByTestId("category-column-confused")).toBeInTheDocument()

    expect(CategoryColumn).toHaveBeenCalledTimes(3)
    expect(CategoryColumn).toHaveBeenCalledWith(
      expect.objectContaining({
        category: "happy",
        ideas: defaultProps.ideas,
        currentUser: defaultProps.currentUser,
        stage: defaultProps.stage,
        actions: defaultProps.actions,
      }),
      expect.anything()
    )
  })

  test("renders a DragOverlay component", () => {
    render(<ColumnarBoardLayout {...defaultProps} />)
    expect(screen.getByTestId("drag-overlay")).toBeInTheDocument()
  })

  describe("drag and drop functionality", () => {
    test("sets active idea on drag start", () => {
      const { rerender } = render(<ColumnarBoardLayout {...defaultProps} />)

      const { onDragStart } = DndContext.mock.calls[0][0]

      onDragStart({ active: { id: "1" } })

      rerender(<ColumnarBoardLayout {...defaultProps} />)

      expect(screen.getByTestId("drag-overlay")).toBeInTheDocument()
    })

    test("calls submitIdeaEditAsync when dragging to a different category", () => {
      render(<ColumnarBoardLayout {...defaultProps} />)

      const { onDragEnd } = DndContext.mock.calls[0][0]

      onDragEnd({
        active: { id: "1" },
        over: {
          id: "droppable-sad",
          data: { current: { category: "sad" } },
        },
      })

      expect(defaultProps.actions.submitIdeaEditAsync).toHaveBeenCalledWith({
        id: 1,
        body: "Idea 1",
        assignee_id: undefined,
        category: "sad",
      })
    })

    test("does not call submitIdeaEditAsync when dragging to the same category", () => {
      render(<ColumnarBoardLayout {...defaultProps} />)

      const { onDragEnd } = DndContext.mock.calls[0][0]

      onDragEnd({
        active: { id: "1" },
        over: {
          id: "droppable-happy",
          data: { current: { category: "happy" } },
        },
      })

      expect(defaultProps.actions.submitIdeaEditAsync).not.toHaveBeenCalled()
    })

    test("does not call submitIdeaEditAsync when there is no over target", () => {
      render(<ColumnarBoardLayout {...defaultProps} />)

      const { onDragEnd } = DndContext.mock.calls[0][0]

      onDragEnd({
        active: { id: "1" },
        over: null,
      })

      expect(defaultProps.actions.submitIdeaEditAsync).not.toHaveBeenCalled()
    })
  })
})
