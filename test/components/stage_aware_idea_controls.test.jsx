import React from "react"

import { StageAwareIdeaControls } from "../../web/static/js/components/stage_aware_idea_controls"
import IdeaEditDeleteIcons from "../../web/static/js/components/idea_edit_delete_icons"
import VotingInterface from "../../web/static/js/components/voting_interface"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, ACTION_ITEMS, CLOSED } = STAGES

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

  context("when the retro is closed", () => {
    context("and idea represents an action-item", () => {
      it("renders no markup", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            isRetroClosed
            idea={{ ...idea, category: "action-item" }}
          />
        )

        expect(wrapper.html()).to.equal(null)
      })
    })

    context("and idea does *not* represent an action item", () => {
      it("renders the voting interface", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            stage={CLOSED}
            idea={{ ...idea, category: "sad" }}
          />
        )

        expect(wrapper.html()).to.match(/<div .*>Votes<\/div/)
      })
    })
  })

  context("when the user has edit permissions", () => {
    it("renders <IdeaEditDeleteIcons />", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <StageAwareIdeaControls
          {...defaultProps}
          canUserEditIdeaContents
        />
      )

      expect(wrapper.find(IdeaEditDeleteIcons)).to.have.length(1)
    })
  })

  context("when the user lacks edit permissions", () => {
    it("does not render <IdeaEditDeleteIcons />", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <StageAwareIdeaControls
          {...defaultProps}
          canUserEditIdeaContents={false}
        />
      )

      expect(wrapper.find(IdeaEditDeleteIcons)).to.have.length(0)
    })
  })

  describe("the vote button", () => {
    context("when the stage is not idea-generation", () => {
      context("and the category is not action-item", () => {
        it("renders, passing the currentUserHasExhaustedVotes prop through", () => {
          const wrapper = mountWithConnectedSubcomponents(
            <StageAwareIdeaControls
              {...defaultProps}
              idea={{ ...idea, category: "sad" }}
              stage={VOTING}
              currentUserHasExhaustedVotes={false}
            />
          )

          const votingInterface = wrapper.find(VotingInterface)
          expect(votingInterface.prop("currentUserHasExhaustedVotes")).to.eql(false)
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
      it("renders a VotingInterface for display purposes", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            stage={ACTION_ITEMS}
          />
        )

        expect(wrapper.find(VotingInterface)).to.have.length(1)
      })
    })
  })
})
