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

  const defaultProps = {
    currentUser: {},
    users: [],
    stage: IDEA_GENERATION,
    isAnActionItemsStage: true,
    canUserEditIdeaContents: true,
    ideaGenerationCategories: [],
    isTabletOrAbove: true,
    idea,
  }

  describe("when the idea is being edited locally", () => {
    const ideaInEditState = { ...idea, inEditState: true, isLocalEdit: true }

    const wrapper = shallow(
      <Idea
        {...defaultProps}
        idea={ideaInEditState}
      />
    )

    test("renders an <IdeaEditForm/> as a child", () => {
      expect(wrapper.find(IdeaEditForm).length).toBe(1)
    })

    describe("when the idea is being edited on a *different* client", () => {
      const ideaInEditState = { ...idea, inEditState: true, isLocalEdit: false }
      const wrapper = shallow(
        <Idea
          {...defaultProps}
          idea={ideaInEditState}
        />
      )

      test("does not render an <IdeaEditForm/> as a child", () => {
        expect(wrapper.find(IdeaEditForm).length).toBe(0)
      })

      describe("when the idea has a `liveEditText` value", () => {
        const wrapper = shallow(
          <Idea
            {...defaultProps}
            idea={{ ...ideaInEditState, liveEditText: "editing bigtime" }}
          />
        )

        test("renders the <IdeaLiveEditContent /> as a child", () => {
          expect(wrapper.find(IdeaLiveEditContent).length).toBe(1)
        })
      })
    })
  })

  describe("when the idea is not in an edit state", () => {
    const ideaInDefaultState = { ...idea, inEditState: false }

    const wrapper = shallow(
      <Idea
        {...defaultProps}
        idea={ideaInDefaultState}
      />
    )

    test("renders <ConditionallyDraggableIdeaContent /> as a child", () => {
      expect(wrapper.find(ConditionallyDraggableIdeaContent).length).toBe(1)
    })

    test("does not render <IdeaEditForm/> as a child", () => {
      expect(wrapper.find(IdeaEditForm).length).toBe(0)
    })

    test("does not render <IdeaLiveEditContent/> as a child", () => {
      expect(wrapper.find(IdeaLiveEditContent).length).toBe(0)
    })
  })
})
