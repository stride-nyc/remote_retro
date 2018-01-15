import React from "react"
import { shallow } from "enzyme"

import { Idea } from "../../web/static/js/components/idea"
import IdeaEditForm from "../../web/static/js/components/idea_edit_form"
import IdeaLiveEditContent from "../../web/static/js/components/idea_live_edit_content"
import IdeaReadOnlyContent from "../../web/static/js/components/idea_read_only_content"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("Idea component", () => {
  const idea = {
    category: "sad",
    body: "redundant tests",
    user_id: 1,
  }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const mockUser = {}
  const mockUsers = [{}]

  context("when the idea is being edited", () => {
    const ideaInEditState = { ...idea, editing: true, editorToken: "aljk" }

    context("and the idea's `editorToken` matches the current user's token", () => {
      const currentUser = { token: "aljk" }
      const wrapper = shallow(
        <Idea
          idea={ideaInEditState}
          currentUser={currentUser}
          retroChannel={mockRetroChannel}
          stage={IDEA_GENERATION}
          users={mockUsers}
        />
      )

      it("renders an <IdeaEditForm/> as a child", () => {
        expect(wrapper.find(IdeaEditForm).length).to.equal(1)
      })
    })

    context("and the idea's `editorToken` does *not* match the current user's token", () => {
      const currentUser = { token: "merp" }
      const wrapper = shallow(
        <Idea
          idea={ideaInEditState}
          currentUser={currentUser}
          retroChannel={mockRetroChannel}
          stage={IDEA_GENERATION}
          users={mockUsers}
        />
      )

      it("does not render an <IdeaEditForm/> as a child", () => {
        expect(wrapper.find(IdeaEditForm).length).to.equal(0)
      })

      context("when the idea has a `liveEditText` value", () => {
        const wrapper = shallow(
          <Idea
            idea={{ ...ideaInEditState, liveEditText: "editing bigtime" }}
            currentUser={currentUser}
            retroChannel={mockRetroChannel}
            stage={IDEA_GENERATION}
            users={mockUsers}
          />
        )
        it("renders the <IdeaLiveEditContent /> as a child", () => {
          expect(wrapper.find(IdeaLiveEditContent).length).to.equal(1)
        })
      })
    })
  })

  context("when the idea is not in an edit state", () => {
    const ideaInDefaultState = { ...idea, editing: false }

    const wrapper = shallow(
      <Idea
        idea={ideaInDefaultState}
        currentUser={mockUser}
        retroChannel={mockRetroChannel}
        stage={IDEA_GENERATION}
        users={mockUsers}
      />
    )

    it("renders <IdeaReadOnlyContent /> as a child", () => {
      expect(wrapper.find(IdeaReadOnlyContent).length).to.equal(1)
    })

    it("does not render <IdeaEditForm/> as a child", () => {
      expect(wrapper.find(IdeaEditForm).length).to.equal(0)
    })

    it("does not render <IdeaLiveEditContent/> as a child", () => {
      expect(wrapper.find(IdeaLiveEditContent).length).to.equal(0)
    })
  })
})
