/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import { StageAwareIdeaControls } from "../../web/static/js/components/stage_aware_idea_controls"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, ACTION_ITEMS, CLOSED } = STAGES

// Mock the child components
jest.mock("../../web/static/js/components/idea_edit_delete_icons", () => {
  return function MockIdeaEditDeleteIcons() {
    return <div data-testid="idea-edit-delete-icons">Edit/Delete Icons</div>
  }
})

jest.mock("../../web/static/js/components/voting_interface", () => {
  return function MockVotingInterface(props) {
    return (
      <div
        data-testid="voting-interface"
        data-exhausted-votes={props.currentUserHasExhaustedVotes}
      >
        Votes
      </div>
    )
  }
})

describe("<StageAwareIdeaControls />", () => {
  const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1 }

  const defaultProps = {
    actions: {},
    idea,
    canUserEditIdeaContents: true,
    votesForIdea: [],
    currentUser: {},
    stage: IDEA_GENERATION,
    isRetroClosed: false,
    currentUserHasExhaustedVotes: true,
  }

  describe("when the retro is closed", () => {
    describe("and idea represents an action-item", () => {
      it("renders no markup", () => {
        const { container } = render(
          <StageAwareIdeaControls
            {...defaultProps}
            isRetroClosed
            idea={{ ...idea, category: "action-item" }}
          />
        )

        expect(container).toBeEmptyDOMElement()
      })
    })

    describe("and idea does *not* represent an action item", () => {
      it("renders the voting interface", () => {
        render(
          <StageAwareIdeaControls
            {...defaultProps}
            stage={CLOSED}
            idea={{ ...idea, category: "sad" }}
          />
        )

        expect(screen.getByTestId("voting-interface")).toBeInTheDocument()
        expect(screen.getByText("Votes")).toBeInTheDocument()
      })
    })
  })

  describe("when the user has edit permissions", () => {
    it("renders <IdeaEditDeleteIcons />", () => {
      render(
        <StageAwareIdeaControls
          {...defaultProps}
          canUserEditIdeaContents
        />
      )

      expect(screen.getByTestId("idea-edit-delete-icons")).toBeInTheDocument()
    })
  })

  describe("when the user lacks edit permissions", () => {
    it("does not render <IdeaEditDeleteIcons />", () => {
      const { container } = render(
        <StageAwareIdeaControls
          {...defaultProps}
          canUserEditIdeaContents={false}
        />
      )

      expect(container).toBeEmptyDOMElement()
    })
  })

  describe("the vote button", () => {
    describe("when the stage is not idea-generation", () => {
      describe("and the category is not action-item", () => {
        it("renders, passing the currentUserHasExhaustedVotes prop through", () => {
          render(
            <StageAwareIdeaControls
              {...defaultProps}
              idea={{ ...idea, category: "sad" }}
              stage={VOTING}
              currentUserHasExhaustedVotes={false}
            />
          )

          const votingInterface = screen.getByTestId("voting-interface")
          expect(votingInterface).toHaveAttribute("data-exhausted-votes", "false")
        })
      })

      describe("and the idea category is action-item", () => {
        it("doesn't render", () => {
          const actionItemIdea = { id: 667, category: "action-item", body: "write tests", user_id: 1 }

          render(
            <StageAwareIdeaControls
              {...defaultProps}
              idea={actionItemIdea}
              stage={VOTING}
            />
          )

          expect(screen.queryByTestId("voting-interface")).not.toBeInTheDocument()
        })
      })
    })

    describe("when the stage is idea-generation", () => {
      it("doesn't render", () => {
        render(
          <StageAwareIdeaControls
            {...defaultProps}
            stage={IDEA_GENERATION}
          />
        )

        expect(screen.queryByTestId("voting-interface")).not.toBeInTheDocument()
      })
    })

    describe("after entering action-items stage", () => {
      it("renders a VotingInterface for display purposes", () => {
        render(
          <StageAwareIdeaControls
            {...defaultProps}
            stage={ACTION_ITEMS}
          />
        )

        expect(screen.getByTestId("voting-interface")).toBeInTheDocument()
      })
    })
  })
})
