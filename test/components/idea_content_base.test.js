import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import IdeaContentBase from "../../web/static/js/components/idea_content_base"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

// Mock the StageAwareIdeaControls component
jest.mock("../../web/static/js/components/stage_aware_idea_controls", () => {
  return function MockStageAwareIdeaControls() {
    return <div data-testid="stage-aware-idea-controls" />
  }
})

describe("<IdeaContentBase />", () => {
  const defaultProps = {
    idea: { body: "body text" },
    currentUser: {},
    stage: IDEA_GENERATION,
    canUserEditIdeaContents: true,
    draggable: false,
  }

  test("renders the control icons before idea body text to ensure floating/text-wrapping", () => {
    render(<IdeaContentBase {...defaultProps} />)

    // Check that the controls are rendered
    expect(screen.getByTestId("stage-aware-idea-controls")).toBeInTheDocument()
    // Check that the idea body is rendered
    expect(screen.getByText("body text")).toBeInTheDocument()
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
