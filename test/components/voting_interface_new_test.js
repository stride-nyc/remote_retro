import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import VotingInterfaceNew from "../../web/static/js/components/voting_interface_new"

describe("VotingInterfaceNew", () => {
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
    userHasExhaustedVotes: true,
  }

  context("during the voting stage", () => {
    it("renders icon buttons", () => {
      const votingInterface = shallow(
        <VotingInterfaceNew
          {...defaultProps}
          isVotingStage
        />
      )

      const plusButton = votingInterface.find(".icon.buttons .plus.button")
      const minusButton = votingInterface.find(".icon.buttons .minus.button")

      expect([plusButton.length, minusButton.length]).to.eql([1, 1])
    })

    context("when the user has exhausted their votes", () => {
      it("disables the add button", () => {
        const votingInterface = shallow(
          <VotingInterfaceNew
            {...defaultProps}
            isVotingStage
            userHasExhaustedVotes
          />
        )

        const plusButton = votingInterface.find(".icon.buttons .plus.button")
        expect(plusButton.prop("disabled")).to.eql(true)
      })
    })

    context("when the user has votes left", () => {
      it("the add button can be engaged", () => {
        const votingInterface = shallow(
          <VotingInterfaceNew
            {...defaultProps}
            isVotingStage
            userHasExhaustedVotes={false}
          />
        )

        const plusButton = votingInterface.find(".icon.buttons .plus.button")
        expect(plusButton.prop("disabled")).to.eql(false)
      })

      describe("clicking the add button", () => {
        it("submits a vote with references to the idea and user", () => {
          const actions = {
            submitVote: spy(),
          }
          const votingInterface = shallow(
            <VotingInterfaceNew
              {...defaultProps}
              actions={actions}
              isVotingStage
              userHasExhaustedVotes={false}
            />
          )

          votingInterface.find(".plus.button").simulate("click")

          expect(actions.submitVote).calledWith(idea, mockUser)
        })
      })
    })

    context("when at least one of the user's votes has been applied to the idea", () => {
      const idea = { id: 53 }
      const currentUser = { id: 1987 }

      it("allows the user to detract the vote", () => {
        const votingInterface = shallow(
          <VotingInterfaceNew
            {...defaultProps}
            isVotingStage
            idea={idea}
            currentUser={currentUser}
            votesForIdea={[{ idea_id: idea.id, user_id: currentUser.id }]}
            userHasExhaustedVotes={false}
          />
        )

        const minusButton = votingInterface.find(".icon.buttons .minus.button")
        expect(minusButton.prop("disabled")).to.eql(false)
      })
    })

    context("when none of the user's votes have been applied to the idea", () => {
      const idea = { id: 53 }
      const currentUser = { id: 1987 }

      it("disallows retraction of votes", () => {
        const votingInterface = shallow(
          <VotingInterfaceNew
            {...defaultProps}
            isVotingStage
            idea={idea}
            currentUser={currentUser}
            votesForIdea={[{ idea_id: idea.id, user_id: 2002 }]}
            userHasExhaustedVotes={false}
          />
        )

        const minusButton = votingInterface.find(".icon.buttons .minus.button")
        expect(minusButton.prop("disabled")).to.eql(true)
      })
    })

    it("renders a tag that contains the vote count for the current user", () => {
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const votesForIdea = [
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
      ]

      const votingInterface = mountWithConnectedSubcomponents(
        <VotingInterfaceNew
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
    it("does not render plus/minus icons", () => {
      const votingInterface = shallow(
        <VotingInterfaceNew
          {...defaultProps}
          isVotingStage={false}
        />
      )

      const plusButton = votingInterface.find(".icon.buttons .plus.icon")
      const minusButton = votingInterface.find(".icon.buttons .minus.button")

      expect([plusButton.length, minusButton.length]).to.eql([0, 0])
    })

    it("renders a tag containing the vote count of the given idea for all users", () => {
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const votesForIdea = [
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
      ]

      const votingInterface = mountWithConnectedSubcomponents(
        <VotingInterfaceNew
          {...defaultProps}
          isVotingStage={false}
          votesForIdea={votesForIdea}
        />
      )

      const label = votingInterface.find("div.basic.label")

      expect(label.text()).to.equal("3")
    })
  })
})
