// IMPORTANT: these tests are on the chopping block, and will be killed once
// the new voting interface is feature complete and we remove the 'subtractVoteDev'
// feature flag. As such, any new work on the voting interface belongs in VotingInterfaceNew

import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import VotingInterfaceOld from "../../web/static/js/components/voting_interface_old"

describe("VotingInterfaceOld", () => {
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
    isVotingStage: true,
  }

  context("when the subtractVoteDev flag isn't engaged", () => {
    beforeEach(() => {
      localStorage.removeItem("subtractVoteDev")
    })

    context("during the voting stage", () => {
      it("renders a tag that contains the vote count for the current user", () => {
        const voteForIdea = { idea_id: 23, user_id: 55 }
        const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
        const votesForIdea = [
          voteForIdea,
          voteForIdea,
          voteForIdeaForOtherUser,
        ]

        const votingInterface = mountWithConnectedSubcomponents(
          <VotingInterfaceOld
            {...defaultProps}
            votesForIdea={votesForIdea}
            isVotingStage
          />
        )
        const label = votingInterface.find("div.basic.label")

        expect(label.text()).to.equal("2")
      })
    })

    context("when rendered outside the voting stage", () => {
      const props = {
        ...defaultProps,
        isVotingStage: false,
      }

      it("renders a tag containing the vote count of the given idea for all users", () => {
        const voteForIdea = { idea_id: 23, user_id: 55 }
        const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
        const votesForIdea = [
          voteForIdea,
          voteForIdea,
          voteForIdeaForOtherUser,
        ]

        const votingInterface = mountWithConnectedSubcomponents(
          <VotingInterfaceOld
            {...props}
            votesForIdea={votesForIdea}
          />
        )
        const label = votingInterface.find("div.basic.label")

        expect(label.text()).to.equal("3")
      })
    })

    context("when flagged as buttonDisabled", () => {
      let votingInterface
      beforeEach(() => {
        votingInterface = shallow(
          <VotingInterfaceOld
            {...defaultProps}
            buttonDisabled
          />
        )
      })

      it("renders the entire VotingInterfaceOld with disabled styling", () => {
        expect(votingInterface.hasClass("disabled")).to.be.true
      })

      // necessary due to keyboard events potentially firing on an already-focused button
      it("renders a functionally disabled green button", () => {
        const button = votingInterface.find(".green.button")
        expect(button.prop("disabled")).to.be.true
      })
    })

    context("when *not* flagged as buttonDisabled", () => {
      let votingInterface

      beforeEach(() => {
        votingInterface = shallow(
          <VotingInterfaceOld
            {...defaultProps}
            buttonDisabled={false}
          />
        )
      })

      it("does *not* render the VotingInterfaceOld with disabled styling", () => {
        expect(votingInterface.hasClass("disabled")).to.be.false
      })

      it("does not disable the functionality of the underlying green button", () => {
        const button = votingInterface.find(".green.button")
        expect(button.prop("disabled")).to.be.false
      })
    })

    describe("clicking the green button therein", () => {
      it("submits a vote with references to the idea and user", () => {
        const submitVote = spy()
        const actions = {
          submitVote,
        }
        const votingInterface = shallow(
          <VotingInterfaceOld
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
})
