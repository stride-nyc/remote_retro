import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithRedux } from "../support/js/test_helper"

import VotingInterface from "../../web/static/js/components/voting_interface"

describe("VotingInterface", () => {
  const ideaToCastVoteFor = {
    id: 23,
    category: "sad",
    body: "redundant tests",
    user_id: 1,
    user: {
      given_name: "Phil",
    },
  }

  const mockUser = { id: 55 }

  const defaultProps = {
    ideaToCastVoteFor,
    actions: {},
    votesForEntity: [],
    currentUser: mockUser,
    isVotingStage: true,
    currentUserHasExhaustedVotes: true,
  }

  describe("during the voting stage", () => {
    test("renders icon buttons", () => {
      render(
        <VotingInterface
          {...defaultProps}
          isVotingStage
        />
      )

      const plusButton = screen.getByText("", { selector: "button.plus.button" })
      const minusButton = screen.getByText("", { selector: "button.minus.button" })

      expect(plusButton).toBeInTheDocument()
      expect(minusButton).toBeInTheDocument()
    })

    describe("when the user has exhausted their votes", () => {
      let submitVoteMock

      beforeEach(() => {
        submitVoteMock = jest.fn()

        render(
          <VotingInterface
            {...defaultProps}
            actions={{ submitVote: submitVoteMock }}
            isVotingStage
            currentUserHasExhaustedVotes
          />
        )
      })

      test("disables the add button", () => {
        const plusButton = screen.getByText("", { selector: "button.plus.button" })
        expect(plusButton).toBeDisabled()
      })

      test("does not submit a vote when they click the add vote button", () => {
        const plusButton = screen.getByText("", { selector: "button.plus.button" })
        fireEvent.click(plusButton)
        expect(submitVoteMock).not.toHaveBeenCalled()
      })
    })

    describe("when the user has votes left", () => {
      test("the add button can be engaged", () => {
        render(
          <VotingInterface
            {...defaultProps}
            isVotingStage
            currentUserHasExhaustedVotes={false}
          />
        )

        const plusButton = screen.getByText("", { selector: "button.plus.button" })
        expect(plusButton).not.toBeDisabled()
      })

      test("clicking the add button submits a vote with references to the idea and user", () => {
        const submitVoteMock = jest.fn()

        render(
          <VotingInterface
            {...defaultProps}
            actions={{ submitVote: submitVoteMock }}
            isVotingStage
            currentUserHasExhaustedVotes={false}
          />
        )

        const plusButton = screen.getByText("", { selector: "button.plus.button" })
        fireEvent.click(plusButton)

        expect(submitVoteMock).toHaveBeenCalledWith(ideaToCastVoteFor, mockUser)
      })
    })

    describe("when at least one of the user's votes has been applied to the idea", () => {
      const ideaToCastVoteFor = { id: 53 }
      const currentUser = { id: 1987 }

      test("allows the user to detract the vote", () => {
        render(
          <VotingInterface
            {...defaultProps}
            isVotingStage
            ideaToCastVoteFor={ideaToCastVoteFor}
            currentUser={currentUser}
            votesForEntity={[{ idea_id: ideaToCastVoteFor.id, user_id: currentUser.id }]}
            currentUserHasExhaustedVotes={false}
          />
        )

        const minusButton = screen.getByText("", { selector: "button.minus.button" })
        expect(minusButton).not.toBeDisabled()
      })

      test("upon clicking the subtract button triggers a vote retraction", () => {
        const someOtherUserId = currentUser.id + 1
        const submitVoteRetractionMock = jest.fn()

        render(
          <VotingInterface
            {...defaultProps}
            actions={{ submitVoteRetraction: submitVoteRetractionMock }}
            ideaToCastVoteFor={ideaToCastVoteFor}
            currentUser={currentUser}
            isVotingStage
            votesForEntity={[{
              id: 1,
              user_id: someOtherUserId,
            }, {
              id: 2,
              user_id: someOtherUserId,
            }, {
              id: 3,
              user_id: currentUser.id,
            }]}
            currentUserHasExhaustedVotes={false}
          />
        )

        const minusButton = screen.getByText("", { selector: "button.minus.button" })
        fireEvent.click(minusButton)

        expect(submitVoteRetractionMock).toHaveBeenCalledWith({ id: 3, user_id: currentUser.id })
      })
    })

    describe("when none of the user's votes have been applied to the idea", () => {
      const ideaToCastVoteFor = { id: 53 }
      const currentUser = { id: 1987 }

      test("disallows retraction of votes", () => {
        render(
          <VotingInterface
            {...defaultProps}
            isVotingStage
            ideaToCastVoteFor={ideaToCastVoteFor}
            currentUser={currentUser}
            votesForEntity={[{ idea_id: ideaToCastVoteFor.id, user_id: 2002 }]}
            currentUserHasExhaustedVotes={false}
          />
        )

        const minusButton = screen.getByText("", { selector: "button.minus.button" })
        expect(minusButton).toBeDisabled()
      })
    })

    test("renders a tag that contains the vote count for the current user", () => {
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const votesForEntity = [
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
      ]

      renderWithRedux(
        <VotingInterface
          {...defaultProps}
          votesForEntity={votesForEntity}
          isVotingStage
        />
      )

      const label = screen.getByText("2")
      expect(label).toBeInTheDocument()
    })
  })

  describe("when rendered outside the voting stage", () => {
    test("does not render plus/minus icons", () => {
      render(
        <VotingInterface
          {...defaultProps}
          isVotingStage={false}
        />
      )

      const plusButton = screen.queryByText("", { selector: "button.plus.button" })
      const minusButton = screen.queryByText("", { selector: "button.minus.button" })

      expect(plusButton).not.toBeInTheDocument()
      expect(minusButton).not.toBeInTheDocument()
    })

    test("renders a tag containing the vote count of the given idea for all users", () => {
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const votesForEntity = [
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
      ]

      renderWithRedux(
        <VotingInterface
          {...defaultProps}
          isVotingStage={false}
          votesForEntity={votesForEntity}
        />
      )

      const label = screen.getByText("3")
      expect(label).toBeInTheDocument()
    })
  })
})
