import React from "react"

import { StageAwareIdeaControls } from "../../web/static/js/components/stage_aware_idea_controls"
import RightFloatedIdeaActions from "../../web/static/js/components/right_floated_idea_actions"
import VoteCounter from "../../web/static/js/components/vote_counter"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, GROUPING, ACTION_ITEMS, CLOSED } = STAGES

describe("<StageAwareIdeaControls />", () => {
  const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1 }
  const mockUser = { id: 2, is_facilitator: true }
  const votes = []
  const actions = {}
  const defaultProps = {
    actions,
    idea,
    votes,
    currentUser: mockUser,
    stage: IDEA_GENERATION,
    retroChannel: { push: () => {}, on: () => {} },
    voteCountForUser: 0,
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

  context("when the user is the facilitator", () => {
    it("renders <RightFloatedIdeaActions />", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <StageAwareIdeaControls
          {...defaultProps}
          currentUser={{ ...mockUser, is_facilitator: true }}
        />
      )

      expect(wrapper.find(RightFloatedIdeaActions)).to.have.length(1)
    })
  })

  context("when the user is not the facilitator", () => {
    context("and the idea is not theirs", () => {
      it("does not render <RightFloatedIdeaActions />", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            idea={{ ...idea, user_id: 3 }}
            currentUser={{ ...mockUser, id: 2, is_facilitator: false }}
          />
        )

        expect(wrapper.find(RightFloatedIdeaActions)).to.have.length(0)
      })
    })

    context("and the idea is theirs", () => {
      const currentUser = { id: 1, is_facilitator: false }
      const freshIdea = { user_id: 1, id: 666, category: "sad", body: "redundant tests" }

      const wrapper = mountWithConnectedSubcomponents(
        <StageAwareIdeaControls
          {...defaultProps}
          idea={freshIdea}
          currentUser={currentUser}
        />
      )

      it("renders <RightFloatedIdeaActions />", () => {
        expect(wrapper.find(RightFloatedIdeaActions)).to.have.length(1)
      })
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

          expect(wrapper.find(VoteCounter)).to.have.length(1)
        })
      })

      context("and the category is action-item", () => {
        it("doesn't render", () => {
          const currentUser = { id: 1, is_facilitator: false }
          const actionItemIdea = { id: 667, category: "action-item", body: "write tests", user_id: 1 }

          const wrapper = mountWithConnectedSubcomponents(
            <StageAwareIdeaControls
              {...defaultProps}
              idea={actionItemIdea}
              currentUser={currentUser}
              stage={VOTING}
            />
          )

          expect(wrapper.find(VoteCounter)).to.have.length(0)
        })
      })
    })

    context("when the stage is idea-generation", () => {
      it("doesn't render", () => {
        const currentUser = { id: 1, is_facilitator: false }

        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            currentUser={currentUser}
            stage={IDEA_GENERATION}
          />
         )

        expect(wrapper.find(VoteCounter)).to.have.length(0)
      })
    })

    context("after entering action-items stage", () => {
      it("renders a disabled VoteCounter for display purposes", () => {
        const currentUser = { id: 1, is_facilitator: false }

        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            currentUser={currentUser}
            stage={ACTION_ITEMS}
          />
         )

        expect(wrapper.find(VoteCounter).prop("buttonDisabled")).to.be.true
      })
    })

    context("when the currentUser has voted 3 times", () => {
      it("renders a disabled VoteCounter for the currentUser", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            voteCountForUser={3}
            stage={VOTING}
          />
         )

        expect(wrapper.find(VoteCounter).prop("buttonDisabled")).to.be.true
      })
    })

    context("when the currentUser has voted under 3 times", () => {
      it("renders an enabled VoteCounter for the currentUser", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <StageAwareIdeaControls
            {...defaultProps}
            voteCountForUser={2}
            stage={VOTING}
          />
        )

        expect(wrapper.find(VoteCounter).prop("buttonDisabled")).to.be.false
      })
    })
  })
})
