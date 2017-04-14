import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import Idea from "../../web/static/js/components/idea"
import IdeaControls from "../../web/static/js/components/idea_controls"
import IdeaEditForm from "../../web/static/js/components/idea_edit_form"

describe("Idea component", () => {
  const idea = { category: "sad", body: "redundant tests", author: "Trizzle" }
  const mockHandleDelete = () => {}
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const mockPresence = { user: {} }

  context("when the user is a facilitator", () => {
    const facilitatorPresence = { user: { is_facilitator: true } }
    const wrapper = shallow(
      <Idea
        idea={idea}
        currentPresence={facilitatorPresence}
        handleDelete={mockHandleDelete}
        retroChannel={mockRetroChannel}
      />
    )

    it("renders <IdeaControls />", () => {
      expect(wrapper.find(IdeaControls).length).to.equal(1)
    })

    it("passes the handleDelete prop to <IdeaControls />", () => {
      const ideaControls = wrapper.find(IdeaControls)
      expect(ideaControls.props().handleDelete).to.equal(mockHandleDelete)
    })
  })

  context("when the user is not a facilitator", () => {
    const nonFacilitatorPresence = { user: { is_facilitator: false } }
    const wrapper = shallow(
      <Idea
        idea={idea}
        currentPresence={nonFacilitatorPresence}
        handleDelete={mockHandleDelete}
        retroChannel={mockRetroChannel}
      />
    )

    it("does not render IdeaControls", () => {
      expect(wrapper.find(IdeaControls).length).to.equal(0)
    })
  })

  context("when the idea is in its default state", () => {
    const ideaInDefaultState = { ...idea, editing: false }

    const wrapper = shallow(
      <Idea
        idea={ideaInDefaultState}
        currentPresence={mockPresence}
        handleDelete={mockHandleDelete}
        retroChannel={mockRetroChannel}
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
        currentPresence={mockPresence}
        handleDelete={mockHandleDelete}
        retroChannel={mockRetroChannel}
      />
    )

    it("has a raised appearance", () => {
      expect(wrapper.hasClass("ui")).to.equal(true)
      expect(wrapper.hasClass("raised")).to.equal(true)
      expect(wrapper.hasClass("segment")).to.equal(true)
    })

    context("and the user is a facilitator", () => {
      const facilitatorPresence = { user: { is_facilitator: true } }
      const wrapper = shallow(
        <Idea
          idea={ideaInEditState}
          currentPresence={facilitatorPresence}
          handleDelete={mockHandleDelete}
          retroChannel={mockRetroChannel}
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
      const nonFacilitatorPresence = { user: { is_facilitator: false } }
      const wrapper = shallow(
        <Idea
          idea={ideaInEditState}
          currentPresence={nonFacilitatorPresence}
          handleDelete={mockHandleDelete}
          retroChannel={mockRetroChannel}
        />
      )

      it("does not render an <IdeaEditForm/> as a child", () => {
        expect(wrapper.find(IdeaEditForm).length).to.equal(0)
      })

      it("informs the user that the idea is being edited", () => {
        expect(wrapper.text()).to.match(/facilitator.*editing/i)
      })
    })
  })
})
