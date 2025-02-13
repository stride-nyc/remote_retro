import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

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

  context("during the voting stage", () => {
    it("renders icon buttons", () => {
      const votingInterface = shallow(
        <VotingInterface
          {...defaultProps}
          isVotingStage
        />
      )

      const plusButton = votingInterface.find(".icon.buttons .plus.button")
      const minusButton = votingInterface.find(".icon.buttons .minus.button")

      expect([plusButton.length, minusButton.length]).to.eql([1, 1])
    })

    context("when the user has exhausted their votes", () => {
      let votingInterface
      let voteSubmissionButton
      let submitVoteSpy

      beforeEach(() => {
        submitVoteSpy = spy()

        votingInterface = shallow(
          <VotingInterface
            {...defaultProps}
            actions={{ submitVote: submitVoteSpy }}
            isVotingStage
            currentUserHasExhaustedVotes
          />
        )

        voteSubmissionButton = votingInterface.find(".icon.buttons .plus.button")
      })

      it("disables the add button", () => {
        expect(voteSubmissionButton.prop("disabled")).to.eql(true)
      })

      context("when a bad actor removes the disabled attribute via dev tools", () => {
        beforeEach(() => {
          voteSubmissionButton.prop("disabled", false)
        })

        it("does not submit a vote when they click the add vote button", () => {
          voteSubmissionButton.simulate("click")
          expect(submitVoteSpy).not.to.have.been.called
        })
      })
    })

    context("when the user has votes left", () => {
      it("the add button can be engaged", () => {
        const votingInterface = shallow(
          <VotingInterface
            {...defaultProps}
            isVotingStage
            currentUserHasExhaustedVotes={false}
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
            <VotingInterface
              {...defaultProps}
              actions={actions}
              isVotingStage
              currentUserHasExhaustedVotes={false}
            />
          )

          votingInterface.find(".plus.button").simulate("click")

          expect(actions.submitVote).calledWith(ideaToCastVoteFor, mockUser)
        })
      })
    })

    context("when at least one of the user's votes has been applied to the idea", () => {
      const ideaToCastVoteFor = { id: 53 }
      const currentUser = { id: 1987 }

      it("allows the user to detract the vote", () => {
        const votingInterface = shallow(
          <VotingInterface
            {...defaultProps}
            isVotingStage
            ideaToCastVoteFor={ideaToCastVoteFor}
            currentUser={currentUser}
            votesForEntity={[{ idea_id: ideaToCastVoteFor.id, user_id: currentUser.id }]}
            currentUserHasExhaustedVotes={false}
          />
        )

        const minusButton = votingInterface.find(".icon.buttons .minus.button")
        expect(minusButton.prop("disabled")).to.eql(false)
      })

      describe("upon clicking the subtract button", () => {
        const someOtherUserId = currentUser.id + 1

        it("triggers a vote retraction, passing a vote belonging to the current user", () => {
          const actions = {
            submitVoteRetraction: spy(),
          }
          const votingInterface = shallow(
            <VotingInterface
              {...defaultProps}
              actions={actions}
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

          votingInterface.find(".minus.button").simulate("click")

          expect(actions.submitVoteRetraction).calledWith({ id: 3, user_id: currentUser.id })
        })
      })
    })

    context("when none of the user's votes have been applied to the idea", () => {
      const ideaToCastVoteFor = { id: 53 }
      const currentUser = { id: 1987 }

      it("disallows retraction of votes", () => {
        const votingInterface = shallow(
          <VotingInterface
            {...defaultProps}
            isVotingStage
            ideaToCastVoteFor={ideaToCastVoteFor}
            currentUser={currentUser}
            votesForEntity={[{ idea_id: ideaToCastVoteFor.id, user_id: 2002 }]}
            currentUserHasExhaustedVotes={false}
          />
        )

        const minusButton = votingInterface.find(".icon.buttons .minus.button")
        expect(minusButton.prop("disabled")).to.eql(true)
      })
    })

    it("renders a tag that contains the vote count for the current user", () => {
      const voteForIdea = { idea_id: 23, user_id: 55 }
      const voteForIdeaForOtherUser = { idea_id: 23, user_id: 77 }
      const votesForEntity = [
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
      ]

      const votingInterface = mountWithConnectedSubcomponents(
        <VotingInterface
          {...defaultProps}
          votesForEntity={votesForEntity}
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
        <VotingInterface
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
      const votesForEntity = [
        voteForIdea,
        voteForIdea,
        voteForIdeaForOtherUser,
      ]

      const votingInterface = mountWithConnectedSubcomponents(
        <VotingInterface
          {...defaultProps}
          isVotingStage={false}
          votesForEntity={votesForEntity}
        />
      )

      const label = votingInterface.find("div.basic.label")

      expect(label.text()).to.equal("3")
    })
  })
})
