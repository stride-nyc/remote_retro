import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import ConditionallyDraggableIdeaContent from "../../web/static/js/components/conditionally_draggable_idea_content"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

// Add data-testid attributes to the components for easier querying
jest.mock("../../web/static/js/components/idea_content_base", () => {
  return function MockIdeaContentBase() {
    // Don't spread props to avoid React warnings about non-DOM props
    return <div data-testid="idea-content-base" />
  }
})

jest.mock("../../web/static/js/components/draggable_idea_content", () => {
  return function MockDraggableIdeaContent() {
    // Don't spread props to avoid React warnings about non-DOM props
    return <div data-testid="draggable-idea-content" />
  }
})

describe("<ConditionallyDraggableIdeaContent />", () => {
  const defaultProps = {
    idea: { body: "body text" },
    currentUser: {},
    isTabletOrAbove: true,
    stage: IDEA_GENERATION,
    canUserEditIdeaContents: true,
  }

  describe("when the device is tablet or larger", () => {
    describe("when the user has edit permissions", () => {
      describe("when the stage is idea-generation", () => {
        test("renders DraggableIdeaContent", () => {
          const props = {
            ...defaultProps,
            isTabletOrAbove: true,
            canUserEditIdeaContents: true,
            stage: "idea-generation",
          }

          render(<ConditionallyDraggableIdeaContent {...props} />)

          expect(screen.getByTestId("draggable-idea-content")).toBeInTheDocument()
          expect(screen.queryByTestId("idea-content-base")).not.toBeInTheDocument()
        })
      })

      describe("when the stage is *not* idea-generation", () => {
        test("renders IdeaContentBase", () => {
          const props = {
            ...defaultProps,
            isTabletOrAbove: true,
            canUserEditIdeaContents: true,
            stage: "voting",
          }

          render(<ConditionallyDraggableIdeaContent {...props} />)

          expect(screen.getByTestId("idea-content-base")).toBeInTheDocument()
          expect(screen.queryByTestId("draggable-idea-content")).not.toBeInTheDocument()
        })
      })
    })

    describe("when the user lacks edit permissions", () => {
      describe("and the stage is idea-generation", () => {
        test("renders IdeaContentBase", () => {
          const props = {
            ...defaultProps,
            isTabletOrAbove: true,
            canUserEditIdeaContents: false,
            stage: IDEA_GENERATION,
          }

          render(<ConditionallyDraggableIdeaContent {...props} />)

          expect(screen.getByTestId("idea-content-base")).toBeInTheDocument()
          expect(screen.queryByTestId("draggable-idea-content")).not.toBeInTheDocument()
        })
      })
    })
  })

  describe("when the device has a screen width less than the common tablet", () => {
    describe("and the user has edit permissions and the stage is idea-generation", () => {
      test("renders IdeaContentBase and not DraggableIdeaContent", () => {
        const props = {
          ...defaultProps,
          isTabletOrAbove: false,
          canUserEditIdeaContents: true,
          stage: "idea-generation",
        }

        render(<ConditionallyDraggableIdeaContent {...props} />)

        expect(screen.getByTestId("idea-content-base")).toBeInTheDocument()
        expect(screen.queryByTestId("draggable-idea-content")).not.toBeInTheDocument()
      })
    })
  })
})
