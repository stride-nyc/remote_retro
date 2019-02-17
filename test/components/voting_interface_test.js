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
    votes: [],
    currentUser: mockUser,
    buttonDisabled: false,
    stage: VOTING,
  }

  context("during the voting stage", () => {
    it("renders an anchor tag that contains the vote count of the given idea for the current user", () => {
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const voteForOtherIdea = { idea_id: 45, user_id: 1 }
      const votes = [
        voteForIdea,
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
        voteForOtherIdea,
      ]

      const voteCounter = mountWithConnectedSubcomponents(
        <VotingInterface
          {...defaultProps}
          votes={votes}
        />
      )
      const label = voteCounter.find("div.basic.label")

      expect(label.text()).to.equal("3")
    })
  })

  context("during the action-items stage", () => {
    it("renders an anchor tag that contains the vote count of the given idea for all users", () => {
      const defaultProps = {
        idea,
        actions: {},
        votes: [],
        currentUser: mockUser,
        buttonDisabled: false,
        stage: ACTION_ITEMS,
      }
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const voteForOtherIdea = { idea_id: 45, user_id: 1 }
      const votes = [
        voteForIdea,
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
        voteForOtherIdea,
      ]

      const voteCounter = mountWithConnectedSubcomponents(
        <VotingInterface
          {...defaultProps}
          votes={votes}
        />
      )
      const label = voteCounter.find("div.basic.label")

      expect(label.text()).to.equal("4")
    })
  })

  context("when buttonDisabled is true", () => {
    let voteCounter
    beforeEach(() => {
      voteCounter = shallow(
        <VotingInterface
          {...defaultProps}
          buttonDisabled
        />
      )
    })

    it("renders the VotingInterface with disabled styling", () => {
      expect(voteCounter.hasClass("disabled")).to.be.true
    })

    // necessary due to keyboard events potentially firing on an already-focused button
    it("renders a functionally disabled button", () => {
      const button = voteCounter.find("button")
      expect(button.prop("disabled")).to.be.true
    })
  })

  context("when buttonDisabled is false", () => {
    let voteCounter
    beforeEach(() => {
      voteCounter = shallow(
        <VotingInterface
          {...defaultProps}
          buttonDisabled={false}
        />
      )
    })

    it("does *not* render the VotingInterface with disabled styling", () => {
      expect(voteCounter.hasClass("disabled")).to.be.false
    })

    it("does not disable the functionality of the underlying button element", () => {
      const button = voteCounter.find("button")
      expect(button.prop("disabled")).to.be.false
    })
  })

  describe("handleClick", () => {
    it("calls actions.submitVote with the idea and currentUser", () => {
      const submitVote = spy()
      const actions = {
        submitVote,
      }
      const voteCounter = shallow(
        <VotingInterface
          {...defaultProps}
          actions={actions}
          idea={idea}
          currentUser={mockUser}
        />
      )
      voteCounter.instance().handleClick()

      expect(submitVote).calledWith(idea, mockUser)
    })
  })
})
