import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import "../support/js/test_helper"
import { useDroppable } from "@dnd-kit/core"

import {
  CategoryColumn,
  mapStateToProps,
} from "../../web/static/js/components/category_column"

jest.mock("@dnd-kit/core", () => {
  const mockSetNodeRef = jest.fn()
  return {
    useDroppable: jest.fn(() => ({
      isOver: false,
      setNodeRef: mockSetNodeRef,
    })),
  }
})

describe("CategoryColumn", () => {
  const defaultProps = {
    ideas: [],
    category: "action-item",
    votes: [],
    stage: "idea-generation",
    actions: {},
  }

  describe("component", () => {
    it("sets up the droppable area with the correct id and data", () => {
      render(<CategoryColumn {...defaultProps} />)
      expect(useDroppable).toHaveBeenCalledWith({
        id: "droppable-action-item",
        data: { category: "action-item" },
      })
    })

    it("applies the dragged-over class when isOver is true", () => {
      useDroppable.mockImplementationOnce(() => ({
        isOver: true,
        setNodeRef: jest.fn(),
      }))
      const { container } = render(<CategoryColumn {...defaultProps} />)
      expect(container.querySelector(".dragged-over")).toBeInTheDocument()
    })

    it("does not apply the dragged-over class when isOver is false", () => {
      useDroppable.mockImplementationOnce(() => ({
        isOver: false,
        setNodeRef: jest.fn(),
      }))
      const { container } = render(<CategoryColumn {...defaultProps} />)
      expect(container.querySelector(".dragged-over")).not.toBeInTheDocument()
    })
    describe("when no categoryDisplayStringOverride is passed", () => {
      it("renders the raw category string in the column header", () => {
        render(<CategoryColumn {...defaultProps} />)

        expect(screen.getByText("action-item")).toBeInTheDocument()
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

        expect(screen.getByText("gobbledygook")).toBeInTheDocument()
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
})
