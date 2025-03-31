import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import _ from "lodash"

import IdeaSubmissionLowerThirdContent from "../../web/static/js/components/idea_submission_lower_third_content"

// Mock the child components to make testing easier
jest.mock("../../web/static/js/components/stage_progression_button", () => {
  return jest.fn(props => (
    <div data-testid="stage-progression-button" data-disabled={props.buttonDisabled}>
      Stage Progression Button
    </div>
  ))
})

jest.mock("../../web/static/js/components/idea_submission_form", () => {
  return jest.fn(() => <div data-testid="idea-submission-form">Idea Submission Form</div>)
})

describe("<IdeaSubmissionLowerThirdContent />", () => {
  const defaultProps = {
    currentUser: {},
    stageConfig: {
      progressionButton: {},
    },
    isAnActionItemsStage: false,
    ideas: [],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("when in a non-action-items stage", () => {
    describe("and there are no ideas", () => {
      const noIdeasProps = { ...defaultProps, isAnActionItemsStage: false, ideas: [] }

      it("renders a disabled <StageProgressionButton>", () => {
        render(<IdeaSubmissionLowerThirdContent {...noIdeasProps} />)

        const button = screen.getByTestId("stage-progression-button")
        expect(button).toBeInTheDocument()
        expect(button.dataset.disabled).toBe("true")
      })
    })

    describe("and there are ideas", () => {
      const propsWithIdeas = {
        ...defaultProps,
        isAnActionItemsStage: false,
        ideas: [{ category: "happy" }],
      }

      it("renders an enabled <StageProgressionButton>", () => {
        render(<IdeaSubmissionLowerThirdContent {...propsWithIdeas} />)

        const button = screen.getByTestId("stage-progression-button")
        expect(button).toBeInTheDocument()
        expect(button.dataset.disabled).toBe("false")
      })

      describe("when there are less than 75 ideas", () => {
        beforeEach(() => {
          const ideas = []

          _.times(74, n => {
            ideas.push({ id: n, body: "gripe!" })
          })

          const props = {
            ...defaultProps,
            isAnActionItemsStage: false,
            ideas,
          }

          render(<IdeaSubmissionLowerThirdContent {...props} />)
        })

        it("renders the IdeaSubmissionForm", () => {
          const ideaSubmissionForm = screen.getByTestId("idea-submission-form")
          expect(ideaSubmissionForm).toBeInTheDocument()
        })

        it("does not surface an idea limit reached notification", () => {
          const ideaLimitText = screen.queryByText(/idea limit reached/i)
          expect(ideaLimitText).not.toBeInTheDocument()
        })
      })
    })

    describe("when there are 75 ideas", () => {
      beforeEach(() => {
        const ideas = []

        _.times(75, n => {
          ideas.push({ id: n, body: "gripe!" })
        })

        const props = {
          ...defaultProps,
          isAnActionItemsStage: false,
          ideas,
        }

        render(<IdeaSubmissionLowerThirdContent {...props} />)
      })

      it("does not render an IdeaSubmissionForm", () => {
        const ideaSubmissionForm = screen.queryByTestId("idea-submission-form")
        expect(ideaSubmissionForm).not.toBeInTheDocument()
      })

      it("surfaces a notification that the idea limit has been reached", () => {
        const ideaLimitText = screen.getByText(/idea limit reached/i)
        expect(ideaLimitText).toBeInTheDocument()
      })
    })
  })

  describe("when in an `action-items` stage", () => {
    describe("and there are no action items", () => {
      it("renders a disabled <StageProgressionButton>", () => {
        render(
          <IdeaSubmissionLowerThirdContent
            {...defaultProps}
            isAnActionItemsStage
            ideas={[]}
          />
        )

        const button = screen.getByTestId("stage-progression-button")
        expect(button).toBeInTheDocument()
        expect(button.dataset.disabled).toBe("true")
      })
    })

    describe("and there are action items", () => {
      it("renders an enabled <StageProgressionButton>", () => {
        render(
          <IdeaSubmissionLowerThirdContent
            {...defaultProps}
            isAnActionItemsStage
            ideas={[{ category: "action-item" }]}
          />
        )

        const button = screen.getByTestId("stage-progression-button")
        expect(button).toBeInTheDocument()
        expect(button.dataset.disabled).toBe("false")
      })
    })
  })
})
