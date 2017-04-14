import React from "react"
import { shallow, mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaEditForm from "../../web/static/js/components/idea_edit_form"

describe("<IdeaEditForm />", () => {
  const idea = { category: "sad", body: "redundant tests", author: "Trizzle" }
  const mockRetroChannel = { on: () => {}, push: () => {} }

  describe("on initial render", () => {
    it("is pre-populated with the given idea's body text", () => {
      const wrapper = shallow(<IdeaEditForm idea={idea} retroChannel={mockRetroChannel} />)

      const textAreaValue = wrapper.find("textarea").props().value
      expect(textAreaValue).to.equal("redundant tests")
    })
  })

  describe("on change of the textarea", () => {
    it("the value prop of the textarea updates in turn", () => {
      const wrapper = mount(<IdeaEditForm idea={idea} retroChannel={mockRetroChannel} />)
      const textarea = wrapper.find("textarea")

      textarea.simulate("change", { target: { value: "some value" } })

      expect(textarea.props().value).to.equal("some value")
    })
  })

  describe("on submitting the form", () => {
    it("pushes an `idea_edited` event to the given retroChannel", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = mount(<IdeaEditForm idea={idea} retroChannel={retroChannel} />)
      const saveButton = wrapper.findWhere(element => (element.text() === "Save"))

      saveButton.simulate("submit")

      expect(
        retroChannel.push.calledWith("idea_edited", { id: idea.id, body: idea.body })
      ).to.equal(true)
    })
  })

  describe("on cancelling out of the edit form", () => {
    it("pushes a `disable_edit_state` event to the given retroChannel", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = mount(<IdeaEditForm idea={idea} retroChannel={retroChannel} />)
      const cancelButton = wrapper.findWhere(element => (element.text() === "Cancel"))

      cancelButton.simulate("click")

      expect(
        retroChannel.push.calledWith("disable_edit_state", { id: idea.id })
      ).to.equal(true)
    })
  })
})
