import React from "react"

import { StageAwareIdeaControls } from "../../web/static/js/components/stage_aware_idea_controls"
import RightFloatedIdeaActions from "../../web/static/js/components/right_floated_idea_actions"
import VotingInterface from "../../web/static/js/components/voting_interface"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, GROUPING, ACTION_ITEMS, CLOSED } = STAGES

describe("<StageAwareIdeaControls />", () => {
  const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1 }

  const defaultProps = {
    actions: {},
    idea,
    canUserEditIdeaContents: true,
    votes: [],
    currentUser: {},
    stage: IDEA_GENERATION,
    retroChannel: { push: () => {}, on: () => {} },
    cumulativeVoteCountForUser: 0,
  }

  context("when the stage is 'grouping'", () => {
    const wrapper = mountWithConnectedSubcomponents(
      <StageAwareIdeaControls
        {...defaultProps}
        stage={GROUPING}
      />
    )

    it("renders no markup", () => {
      expect(wrapper.html()).to.equal(null)
    })
  })

  context("when the stage is closed", () => {
    context("and idea represents an action-item", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <StageAwareIdeaControls
          {...defaultProps}
          stage={CLOSED}
          idea={{ ...idea, category: "action-item" }}
        />
      )

      it("renders no markup", () => {
        expect(wrapper.html()).to.equal(null)
      })
    })

    context("and idea does *not* represent an action item", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <StageAwareIdeaControls
          {...defaultProps}
          stage={CLOSED}
          idea={{ ...idea, category: "sad" }}
        />
      )

      it("renders the disabled voting interface", () => {
        expect(wrapper.html()).to.match(/<button .* disabled.*>Vote<\/button/)
      })
    })
  })

  context("when the user has edit permissions", () => {
    it("renders <RightFloatedIdeaActions />", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <StageAwareIdeaControls
          {...defaultProps}
          canUserEditIdeaContents
        />
      )

      expect(wrapper.find(RightFloatedIdeaActions)).to.have.length(1)
    })
  })

  context("when the user lacks edit permissions", () => {
    it("does not render <RightFloatedIdeaActions />", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <StageAwareIdeaControls
          {...defaultProps}
          canUserEditIdeaContents={false}
        />
      )

      expect(wrapper.find(RightFloatedIdeaActions)).to.have.length(0)
    })
  })

  describe("the vote button", () => {
    context("when the stage is not idea-generation", () => {
      context("and the category is not action-item", () => {
        it("renders", () => {
          const wrapper = mountWithConnectedSubcomponents(
            <StageAwareIdeaControls
              {...defaultProps}
              idea={{ ...idea, category: "sad" }}
              stage={VOTING}
            />
          )

          expect(wrapper.find(VotingInterface)).to.have.length(1)
        })
      })

      context("and the idea category is action-item", () => {
        it("doesn't render", () => {
          const actionItemIdea = { id: 667, category: "action-item", body: "write tests", user_id: 1 }

          const wrapper = mountWithConnectedSubcomponents(
            <StageAwareIdeaControls
              {...defaultProps}
              idea={actionItemIdea}
              stage={VOTING}
            />
          )

          expect(wrapper.find(VotingInterface)).to.have.length(0)
        })
      })
    })

    context("when the stage is idea-generation", () => {
      it("doesn't render", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            stage={IDEA_GENERATION}
          />
        )

        expect(wrapper.find(VotingInterface)).to.have.length(0)
      })
    })

    context("after entering action-items stage", () => {
      it("renders a disabled VotingInterface for display purposes", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            stage={ACTION_ITEMS}
          />
        )

        expect(wrapper.find(VotingInterface).prop("buttonDisabled")).to.be.true
      })
    })

    context("when the currentUser has voted 3 times", () => {
      it("renders a disabled VotingInterface for the currentUser", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            cumulativeVoteCountForUser={3}
            stage={VOTING}
          />
        )

        expect(wrapper.find(VotingInterface).prop("buttonDisabled")).to.be.true
      })
    })

    context("when the currentUser has voted under 3 times", () => {
      it("renders an enabled VotingInterface for the currentUser", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            cumulativeVoteCountForUser={2}
            stage={VOTING}
          />
        )

        expect(wrapper.find(VotingInterface).prop("buttonDisabled")).to.be.false
      })
    })
  })
})
