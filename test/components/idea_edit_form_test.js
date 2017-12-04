import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import IdeaEditForm from "../../web/static/js/components/idea_edit_form"
import { CATEGORIES } from "../../web/static/js/configs/retro_configs"

describe("<IdeaEditForm />", () => {
  const idea = { id: 999, category: "sad", body: "redundant tests", userId: 1 }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const stage = "idea-generation"
  const categories = CATEGORIES
  const defaultProps = {
    idea,
    retroChannel: mockRetroChannel,
    categories,
    stage,
    category: idea.category,
  }

  describe("on initial render", () => {
    it("is pre-populated with the given idea's body text", () => {
      const wrapper = shallow(<IdeaEditForm {...defaultProps} />)

      const textAreaValue = wrapper.find("textarea").props().value
      expect(textAreaValue).to.equal("redundant tests")
    })
  })

  describe("on change of the textarea", () => {
    let retroChannel
    let textarea
    let wrapper

    beforeEach(() => {
      retroChannel = { on: () => {}, push: sinon.spy() }
      wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} retroChannel={retroChannel} />
      )
      textarea = wrapper.find("textarea")
      textarea.simulate("change", { target: { name: "editable_idea", value: "some value" } })
    })

    it("the value prop of the textarea updates in turn", () => {
      expect(textarea.props().value).to.equal("some value")
    })

    it("pushes a `idea_live_edit` event to the retroChannel, passing current input value", () => {
      expect(
        retroChannel.push.calledWith("idea_live_edit", { id: idea.id, liveEditText: "some value" })
      ).to.equal(true)
    })
  })

  describe("on change of the category", () => {
    let retroChannel
    let categoryDropdown
    let wrapper

    beforeEach(() => {
      retroChannel = { on: () => {}, push: sinon.spy() }
      wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} retroChannel={retroChannel} category="sad" />
      )
      categoryDropdown = wrapper.find("select")
      categoryDropdown.simulate("change", { target: { name: "editable_category", value: "confused" } })
    })

    it("the value prop of the category updates in turn", () => {
      expect(wrapper.find("select").props().value).to.equal("confused")
    })
  })

  describe("on submitting the form", () => {
    it("pushes an `idea_edited` event to the given retroChannel", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} retroChannel={retroChannel} />
      )
      const saveButton = wrapper.findWhere(element => (element.text() === "Save"))

      saveButton.simulate("submit")

      expect(
        retroChannel.push.calledWith("idea_edited", {
          id: idea.id,
          body: idea.body,
          category: idea.category,
        })
      ).to.equal(true)
    })
  })

  describe("on cancelling out of the edit form", () => {
    it("pushes a `disable_edit_state` event to the given retroChannel", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} retroChannel={retroChannel} />
      )
      const cancelButton = wrapper.findWhere(element => (element.text() === "Cancel"))

      cancelButton.simulate("click")

      expect(
        retroChannel.push.calledWith("disable_edit_state", { id: idea.id })
      ).to.equal(true)
    })
  })
})
