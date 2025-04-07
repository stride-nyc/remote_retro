import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { useDraggable } from "@dnd-kit/core"

import IdeaContentBase from "../../web/static/js/components/idea_content_base"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

// Mock the useDraggable hook
jest.mock("@dnd-kit/core", () => ({
  useDraggable: jest.fn(() => ({
    attributes: { "aria-pressed": false },
    listeners: { onDragStart: jest.fn() },
    setNodeRef: jest.fn(),
  })),
}))

jest.mock("../../web/static/js/components/stage_aware_idea_controls", () => {
  return function MockStageAwareIdeaControls() {
    return <div data-testid="stage-aware-idea-controls" />
  }
})

describe("<IdeaContentBase />", () => {
  const defaultProps = {
    idea: { body: "body text", id: 123 },
    currentUser: {},
    stage: IDEA_GENERATION,
    canUserEditIdeaContents: true,
    isIdeaDragEligible: false,
  }

  test("renders the control icons before idea body text to ensure floating/text-wrapping", () => {
    render(<IdeaContentBase {...defaultProps} />)

    expect(screen.getByTestId("stage-aware-idea-controls")).toBeInTheDocument()
    expect(screen.getByText("body text")).toBeInTheDocument()
  })

  describe("when isIdeaDragEligible is true", () => {
    beforeEach(() => {
      useDraggable.mockClear()
    })

    test("calls useDraggable with the correct parameters", () => {
      const idea = { body: "draggable idea", id: 456, inEditState: false }

      render(
        <IdeaContentBase
          {...defaultProps}
          idea={idea}
          isIdeaDragEligible
        />
      )

      expect(useDraggable).toHaveBeenCalledWith({
        id: "456",
        data: { idea },
        disabled: false,
      })
    })

    test("applies the draggable class to the idea content", () => {
      const idea = { body: "draggable idea", id: 456 }

      const { container } = render(
        <IdeaContentBase
          {...defaultProps}
          idea={idea}
          isIdeaDragEligible
        />
      )

      // Find the div containing the idea content
      const ideaContentDiv = container.querySelector("div:nth-child(2)")
      expect(ideaContentDiv).toHaveClass("draggable")
    })

    test("disables dragging when idea is in edit state", () => {
      const idea = { body: "editing idea", id: 789, inEditState: true }

      render(
        <IdeaContentBase
          {...defaultProps}
          idea={idea}
          isIdeaDragEligible
        />
      )

      expect(useDraggable).toHaveBeenCalledWith({
        id: "789",
        data: { idea },
        disabled: true,
      })
    })
  })

  describe("when isIdeaDragEligible is false", () => {
    beforeEach(() => {
      useDraggable.mockClear()
    })

    test("does not call useDraggable", () => {
      render(<IdeaContentBase {...defaultProps} />)

      expect(useDraggable).not.toHaveBeenCalled()
    })

    test("does not apply the draggable class to the idea content", () => {
      const { container } = render(<IdeaContentBase {...defaultProps} />)

      // Find the div containing the idea content
      const ideaContentDiv = container.querySelector("div:nth-child(2)")
      expect(ideaContentDiv).not.toHaveClass("draggable")
    })
  })

  describe("when the idea's updated_at value is greater than its inserted_at value", () => {
    test("informs the user that the idea has been edited", () => {
      const editedIdea = {
        body: "edited idea",
        inserted_at: "2017-04-14T17:30:10",
        updated_at: "2017-04-14T17:30:12",
      }

      render(
        <IdeaContentBase
          {...defaultProps}
          idea={editedIdea}
        />
      )

      expect(screen.getByText(/edited idea/)).toBeInTheDocument()
      expect(screen.getByText(/\(edited\)/i)).toBeInTheDocument()
    })
  })

  describe("when the idea's updated_at value is equal to its inserted_at value", () => {
    test("mentions nothing about the idea being edited", () => {
      const nonEditedIdea = {
        body: "non-edited idea",
        inserted_at: "2017-04-14T17:30:10",
        updated_at: "2017-04-14T17:30:10",
      }

      render(
        <IdeaContentBase
          {...defaultProps}
          idea={nonEditedIdea}
        />
      )

      expect(screen.getByText(/non-edited idea/)).toBeInTheDocument()
      expect(screen.queryByText(/\(edited\)/i)).not.toBeInTheDocument()
    })
  })

  describe("when the idea has an assignee", () => {
    test("contains the assignee's name next to the idea", () => {
      const assignee = {
        name: "Betty White",
      }

      const idea = {
        body: "Do the thing",
      }

      render(
        <IdeaContentBase
          {...defaultProps}
          assignee={assignee}
          idea={idea}
        />
      )

      expect(screen.getByText("Do the thing")).toBeInTheDocument()
      expect(screen.getByText(/\(Betty White\)/)).toBeInTheDocument()
    })
  })

  describe("when the idea *lacks* an assignee", () => {
    test("does not add a parenthetical after the idea body", () => {
      const idea = {
        body: "Sleep better",
      }

      render(
        <IdeaContentBase
          {...defaultProps}
          assignee={null}
          idea={idea}
        />
      )

      expect(screen.getByText("Sleep better")).toBeInTheDocument()
      expect(screen.queryByText(/\(.*\)/)).not.toBeInTheDocument()
    })
  })
})
