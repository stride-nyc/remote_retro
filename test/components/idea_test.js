import React from "react"
import { shallow } from "enzyme"

import Idea from "../../web/static/js/components/idea"
import IdeaEditForm from "../../web/static/js/components/idea_edit_form"
import IdeaLiveEditContent from "../../web/static/js/components/idea_live_edit_content"
import IdeaReadOnlyContent from "../../web/static/js/components/idea_read_only_content"
import STAGES from "../../web/static/js/configs/stages"
import { CATEGORIES } from "../../web/static/js/configs/retro_configs"

const { IDEA_GENERATION } = STAGES

describe("Idea component", () => {
  const idea = {
    category: "sad",
    body: "redundant tests",
    user_id: 1,
  }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const mockUser = {}

  context("when the user is a facilitator", () => {
    const facilitatorUser = { is_facilitator: true }
    const wrapper = mountWithConnectedSubcomponents(
      <Idea
        idea={idea}
        currentUser={facilitatorUser}
        retroChannel={mockRetroChannel}
        stage={IDEA_GENERATION}
        category={idea.category}
        categories={CATEGORIES}
      />
    )

    it("renders <IdeaControls />", () => {
      expect(wrapper.find(IdeaControls).length).to.equal(1)
    })

    it("renders IdeaControls as its first child for proper floating/text-wrapping", () => {
      expect(wrapper.childAt(0).html()).to.match(/edit idea/i)
    })

    context("when the stage is closed", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <Idea
          idea={idea}
          currentUser={facilitatorUser}
          retroChannel={mockRetroChannel}
          stage={CLOSED}
          category={idea.category}
          categories={CATEGORIES}
        />
      )

      it("doesn't render <IdeaControls />", () => {
        expect(wrapper.find(IdeaControls).length).to.equal(0)
      })
    })
  })

  context("when the idea is in its default state", () => {
    const ideaInDefaultState = { ...idea, editing: false }

    const wrapper = shallow(
      <Idea
        idea={ideaInDefaultState}
        currentUser={mockUser}
        retroChannel={mockRetroChannel}
        stage={IDEA_GENERATION}
        category={idea.category}
        categories={CATEGORIES}
      />
    )

    it("does not have a raised appearance", () => {
      expect(wrapper.hasClass("raised")).to.equal(false)
    })

    it("does not render an <IdeaEditForm/> as a child", () => {
      expect(wrapper.find(IdeaEditForm).length).to.equal(0)
    })
  })

  context("when the idea is being edited", () => {
    const ideaInEditState = { ...idea, editing: true, editorToken: "aljk" }

    const wrapper = shallow(
      <Idea
        idea={ideaInEditState}
        currentUser={mockUser}
        retroChannel={mockRetroChannel}
        stage={IDEA_GENERATION}
        category={idea.category}
        categories={CATEGORIES}
      />
    )

    it("has a raised appearance", () => {
      expect(wrapper.hasClass("ui")).to.equal(true)
      expect(wrapper.hasClass("raised")).to.equal(true)
      expect(wrapper.hasClass("segment")).to.equal(true)
    })

    context("and the idea's `editorToken` matches the current user's token", () => {
      const currentUser = { token: "aljk" }
      const wrapper = shallow(
        <Idea
          idea={ideaInEditState}
          currentUser={currentUser}
          retroChannel={mockRetroChannel}
          stage={IDEA_GENERATION}
          category={idea.category}
          categories={CATEGORIES}
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
          category={idea.category}
          categories={CATEGORIES}
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
            category={idea.category}
            categories={CATEGORIES}
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
        category={idea.category}
        categories={CATEGORIES}
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
