import React from "react"
import { shallow } from "enzyme"

import { Idea } from "../../web/static/js/components/idea"
import IdeaEditForm from "../../web/static/js/components/idea_edit_form"
import IdeaLiveEditContent from "../../web/static/js/components/idea_live_edit_content"
import ConditionallyDraggableIdeaContent from "../../web/static/js/components/conditionally_draggable_idea_content"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("Idea component", () => {
  const idea = {
    category: "sad",
    body: "redundant tests",
    user_id: 1,
  }

  const mockRetroChannel = { on: () => {}, push: () => {} }

  const defaultProps = {
    currentUser: {},
    users: [],
    retroChannel: mockRetroChannel,
    stage: IDEA_GENERATION,
    canUserEditIdeaContents: true,
    isTabletOrAbove: true,
    idea,
  }

  context("when the idea is being edited locally", () => {
    const ideaInEditState = { ...idea, inEditState: true, isLocalEdit: true }

    const wrapper = shallow(
      <Idea
        {...defaultProps}
        idea={ideaInEditState}
      />
    )

    it("renders an <IdeaEditForm/> as a child", () => {
      expect(wrapper.find(IdeaEditForm).length).to.equal(1)
    })

    context("when the idea is being edited on a *different* client", () => {
      const ideaInEditState = { ...idea, inEditState: true, isLocalEdit: false }
      const wrapper = shallow(
        <Idea
          {...defaultProps}
          idea={ideaInEditState}
        />
      )

      it("does not render an <IdeaEditForm/> as a child", () => {
        expect(wrapper.find(IdeaEditForm).length).to.equal(0)
      })

      context("when the idea has a `liveEditText` value", () => {
        const wrapper = shallow(
          <Idea
            {...defaultProps}
            idea={{ ...ideaInEditState, liveEditText: "editing bigtime" }}
          />
        )

        it("renders the <IdeaLiveEditContent /> as a child", () => {
          expect(wrapper.find(IdeaLiveEditContent).length).to.equal(1)
        })
      })
    })
  })

  context("when the idea is not in an edit state", () => {
    const ideaInDefaultState = { ...idea, inEditState: false }

    const wrapper = shallow(
      <Idea
        {...defaultProps}
        idea={ideaInDefaultState}
      />
    )

    it("renders <ConditionallyDraggableIdeaContent /> as a child", () => {
      expect(wrapper.find(ConditionallyDraggableIdeaContent).length).to.equal(1)
    })

    it("does not render <IdeaEditForm/> as a child", () => {
      expect(wrapper.find(IdeaEditForm).length).to.equal(0)
    })

    it("does not render <IdeaLiveEditContent/> as a child", () => {
      expect(wrapper.find(IdeaLiveEditContent).length).to.equal(0)
    })
  })
})
