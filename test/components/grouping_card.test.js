import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import GroupingCard from "../../web/static/js/components/grouping_card"
import ColorPicker from "../../web/static/js/services/color_picker"

const mockUseDraggable = jest.fn().mockReturnValue({
  attributes: { "data-test": "draggable-attributes" },
  listeners: { "data-test": "draggable-listeners" },
  setNodeRef: jest.fn(),
  transform: { x: 0, y: 0 },
  isDragging: false,
})

jest.mock("@dnd-kit/core", () => ({
  useDraggable: () => mockUseDraggable(),
}))

jest.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Translate: {
      toString: jest.fn().mockReturnValue("translate3d(0px, 0px, 0px)"),
    },
  },
}))

jest.mock("../../web/static/js/services/color_picker", () => ({
  fromSeed: jest.fn().mockReturnValue("#123456"),
}))

describe("GroupingCard", () => {
  const defaultProps = {
    idea: {
      id: 1,
      category: "happy",
      body: "Test idea",
      x: 10,
      y: 20,
    },
    isActive: false,
    currentUser: { id: 123 },
    userOptions: { highContrastOn: false },
    children: <span data-testid="card-content">Test content</span>,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the card with the provided children", () => {
    render(<GroupingCard {...defaultProps} />)
    expect(screen.getByTestId("card-content")).toBeInTheDocument()
    expect(screen.getByTestId("card-content")).toHaveTextContent("Test content")
  })

  it("applies the correct positioning based on idea coordinates when not dragging", () => {
    const { container } = render(<GroupingCard {...defaultProps} />)
    const card = container.querySelector(".idea-card")
    expect(card).toHaveStyle({
      position: "relative",
      top: "20px",
      left: "10px",
    })
  })

  it("updates position when idea coordinates change and not dragging", () => {
    const { container, rerender } = render(<GroupingCard {...defaultProps} />)

    const updatedIdea = {
      ...defaultProps.idea,
      x: 50,
      y: 60,
    }

    rerender(
      <GroupingCard
        {...defaultProps}
        idea={updatedIdea}
      />
    )

    const card = container.querySelector(".idea-card")
    expect(card).toHaveStyle({
      position: "relative",
      top: "60px",
      left: "50px",
    })
  })

  describe("when dragging", () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mockUseDraggable.mockReturnValue({
        attributes: { "data-test": "draggable-attributes" },
        listeners: { "data-test": "draggable-listeners" },
        setNodeRef: jest.fn(),
        transform: { x: 0, y: 0 },
        isDragging: true,
      })
    })

    afterEach(() => {
      mockUseDraggable.mockReturnValue({
        attributes: { "data-test": "draggable-attributes" },
        listeners: { "data-test": "draggable-listeners" },
        setNodeRef: jest.fn(),
        transform: { x: 0, y: 0 },
        isDragging: false,
      })
    })

    it("uses dragStartPosition for positioning", () => {
      const { container } = render(<GroupingCard {...defaultProps} />)
      const card = container.querySelector(".idea-card")

      expect(card).toHaveStyle({
        position: "relative",
        top: "20px",
        left: "10px",
      })
    })

    it("maintains dragStartPosition when idea coordinates change during dragging", () => {
      const { container, rerender } = render(<GroupingCard {...defaultProps} />)

      const updatedIdea = {
        ...defaultProps.idea,
        x: 50,
        y: 60,
      }

      rerender(
        <GroupingCard
          {...defaultProps}
          idea={updatedIdea}
        />
      )

      const card = container.querySelector(".idea-card")

      expect(card).toHaveStyle({
        position: "relative",
        top: "20px",
        left: "10px",
      })
    })
  })

  it("applies the correct data-category attribute", () => {
    const { container } = render(<GroupingCard {...defaultProps} />)
    const card = container.querySelector(".idea-card")
    expect(card).toHaveAttribute("data-category", "happy")
  })

  describe("when another user is dragging the card", () => {
    it("applies reduced opacity and not-allowed cursor", () => {
      const { container } = render(
        <GroupingCard
          {...defaultProps}
          idea={{ ...defaultProps.idea, dragging_user_id: 456 }}
        />
      )
      const card = container.querySelector(".idea-card")
      expect(card).toHaveStyle({
        opacity: "0.5",
        cursor: "not-allowed",
      })
    })

    it("does not apply draggable attributes and listeners", () => {
      const { container } = render(
        <GroupingCard
          {...defaultProps}
          idea={{ ...defaultProps.idea, dragging_user_id: 456 }}
        />
      )
      const card = container.querySelector(".idea-card")
      expect(card).not.toHaveAttribute("data-test", "draggable-attributes")
      expect(card).not.toHaveAttribute("data-test", "draggable-listeners")
    })
  })

  describe("when the current user is dragging the card", () => {
    it("applies draggable attributes and listeners", () => {
      const { container } = render(
        <GroupingCard
          {...defaultProps}
          idea={{ ...defaultProps.idea, dragging_user_id: 123 }}
        />
      )
      const card = container.querySelector(".idea-card")
      expect(card).toHaveStyle({
        opacity: "1",
        cursor: "move",
      })
    })
  })

  describe("when the card has a groupId", () => {
    it("applies a colored box shadow and border using ColorPicker", () => {
      const { container } = render(<GroupingCard {...defaultProps} groupId={42} />)
      const card = container.querySelector(".idea-card")
      expect(ColorPicker.fromSeed).toHaveBeenCalledWith(42)
      expect(card).toHaveStyle({
        boxShadow: "0 0 0px 2px #123456",
        border: "1px solid #123456",
      })
    })

    describe("when high contrast mode is enabled", () => {
      it("uses black color instead of ColorPicker", () => {
        const { container } = render(
          <GroupingCard
            {...defaultProps}
            groupId={42}
            userOptions={{ highContrastOn: true }}
          />
        )
        const card = container.querySelector(".idea-card")
        expect(card).toHaveStyle({
          boxShadow: "0 0 0px 2px #000000",
          border: "1px solid #000000",
        })
      })
    })
  })

  describe("ref forwarding", () => {
    it("forwards the ref to the underlying element", () => {
      const ref = { current: null }
      render(<GroupingCard {...defaultProps} ref={ref} />)
      expect(ref.current).not.toBeNull()
      expect(ref.current.tagName).toBe("P")
      expect(ref.current).toHaveClass("idea-card")
    })

    it("works with function refs", () => {
      const refFn = jest.fn()
      render(<GroupingCard {...defaultProps} ref={refFn} />)
      expect(refFn).toHaveBeenCalled()
      const calledWithElement = refFn.mock.calls[0][0]
      expect(calledWithElement.tagName).toBe("P")
      expect(calledWithElement).toHaveClass("idea-card")
    })
  })
})
