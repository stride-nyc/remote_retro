import React from "react"
import { shallow } from "enzyme"

import Idea from "../../web/static/js/components/idea"
import IdeaControls from "../../web/static/js/components/idea_controls"
import IdeaEditForm from "../../web/static/js/components/idea_edit_form"
import STAGES from "../../web/static/js/configs/stages"
import { CATEGORIES } from "../../web/static/js/configs/retro_configs"

const { IDEA_GENERATION, CLOSED } = STAGES

describe("Idea component", () => {
  const idea = {
    category: "sad",
    body: "redundant tests",
    user_id: 1,
    user: {
      given_name: "Phil",
    },
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
    const ideaInEditState = { ...idea, editing: true }

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

    context("and the user is a facilitator", () => {
      const facilitatorUser = { is_facilitator: true }
      const wrapper = shallow(
        <Idea
          idea={ideaInEditState}
          currentUser={facilitatorUser}
          retroChannel={mockRetroChannel}
          stage={IDEA_GENERATION}
          category={idea.category}
          categories={CATEGORIES}
        />
      )

      it("renders an <IdeaEditForm/> as a child", () => {
        expect(wrapper.find(IdeaEditForm).length).to.equal(1)
      })

      it("does not inform the user that the idea is being edited", () => {
        expect(wrapper.text()).to.not.match(/editing/i)
      })
    })

    context("and the user is not a facilitator", () => {
      const nonFacilitatorUser = { is_facilitator: false }
      const wrapper = shallow(
        <Idea
          idea={ideaInEditState}
          currentUser={nonFacilitatorUser}
          retroChannel={mockRetroChannel}
          stage={IDEA_GENERATION}
          category={idea.category}
          categories={CATEGORIES}
        />
      )

      it("does not render an <IdeaEditForm/> as a child", () => {
        expect(wrapper.find(IdeaEditForm).length).to.equal(0)
      })

      it("informs the user that the idea is being edited", () => {
        expect(wrapper.text()).to.match(/facilitator.*editing/i)
      })

      context("when the idea has a `liveEditText` value", () => {
        const wrapper = shallow(
          <Idea
            idea={{ ...ideaInEditState, liveEditText: "editing bigtime" }}
            currentUser={nonFacilitatorUser}
            retroChannel={mockRetroChannel}
            stage={IDEA_GENERATION}
            category={idea.category}
            categories={CATEGORIES}
          />
        )
        it("displays the `liveEditText` value rather than the body value", () => {
          expect(wrapper.text()).to.match(/editing bigtime/i)
          expect(wrapper.text()).to.not.match(/redundant tests/i)
        })
      })
    })
  })

  context("when the idea's updated_at value is more than one second greater than its inserted_at value", () => {
    const editedIdea = {
      inserted_at: "2017-04-14T17:30:10",
      updated_at: "2017-04-14T17:30:12",
      user: {
        given_name: "Liz",
      },
    }

    const wrapper = shallow(
      <Idea
        idea={editedIdea}
        currentUser={mockUser}
        retroChannel={mockRetroChannel}
        stage={IDEA_GENERATION}
        category={idea.category}
        categories={CATEGORIES}
      />
    )

    it("informs the user that the idea has been edited", () => {
      expect(wrapper.text()).to.match(/\(edited\)/i)
    })
  })
})
