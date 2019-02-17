import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import VotingInterface from "../../web/static/js/components/voting_interface"
import STAGES from "../../web/static/js/configs/stages"

const { ACTION_ITEMS, VOTING } = STAGES

describe("VotingInterface", () => {
  const idea = {
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
    idea,
    actions: {},
    votesForIdea: [],
    currentUser: mockUser,
    buttonDisabled: false,
    stage: VOTING,
  }

  context("during the voting stage", () => {
    it("renders an anchor tag that contains the vote count for the current user", () => {
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const votesForIdea = [
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
      ]

      const voteCounter = mountWithConnectedSubcomponents(
        <VotingInterface
          {...defaultProps}
          votesForIdea={votesForIdea}
        />
      )
      const label = voteCounter.find("div.basic.label")

      expect(label.text()).to.equal("2")
    })
  })

  context("during the action-items stage", () => {
    it("renders an anchor tag that contains the vote count of the given idea for all users", () => {
      const defaultProps = {
        idea,
        actions: {},
        votesForIdea: [],
        currentUser: mockUser,
        buttonDisabled: false,
        stage: ACTION_ITEMS,
      }
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const votesForIdea = [
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
      ]

      const votingInterface = mountWithConnectedSubcomponents(
        <VotingInterface
          {...defaultProps}
          votesForIdea={votesForIdea}
        />
      )
      const label = votingInterface.find("div.basic.label")

      expect(label.text()).to.equal("3")
    })
  })

  context("when buttonDisabled is true", () => {
    let votingInterface
    beforeEach(() => {
      votingInterface = shallow(
        <VotingInterface
          {...defaultProps}
          buttonDisabled
        />
      )
    })

    it("renders the VotingInterface with disabled styling", () => {
      expect(votingInterface.hasClass("disabled")).to.be.true
    })

    // necessary due to keyboard events potentially firing on an already-focused button
    it("renders a functionally disabled button", () => {
      const button = votingInterface.find("button")
      expect(button.prop("disabled")).to.be.true
    })
  })

  context("when buttonDisabled is false", () => {
    let votingInterface
    beforeEach(() => {
      votingInterface = shallow(
        <VotingInterface
          {...defaultProps}
          buttonDisabled={false}
        />
      )
    })

    it("does *not* render the VotingInterface with disabled styling", () => {
      expect(votingInterface.hasClass("disabled")).to.be.false
    })

    it("does not disable the functionality of the underlying button element", () => {
      const button = votingInterface.find("button")
      expect(button.prop("disabled")).to.be.false
    })
  })

  describe("clicking the button therein", () => {
    it("submits a vote with references to the idea and user", () => {
      const submitVote = spy()
      const actions = {
        submitVote,
      }
      const votingInterface = shallow(
        <VotingInterface
          {...defaultProps}
          actions={actions}
          idea={idea}
          currentUser={mockUser}
        />
      )

      votingInterface.find(".green.button").simulate("click")

      expect(submitVote).calledWith(idea, mockUser)
    })
  })
})
