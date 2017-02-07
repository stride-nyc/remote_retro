import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaSubmissionForm from "../../web/static/js/components/idea_submission_form"
describe("IdeaSubmissionForm component", () => {
  let wrapper

  const onSubmitIdeaStub = () => {}
  const fakeEvent = {
    stopPropagation: ()=> undefined,
    preventDefault: ()=> undefined,
  }

  describe("on submit", () => {
    it("invokes the function passed as the onIdeaSubmission prop", () => {
      const onSubmitIdeaSpy = sinon.spy(() => {})
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={ onSubmitIdeaSpy }/>)

      wrapper.simulate("submit", fakeEvent)

      expect(onSubmitIdeaSpy.called).to.equal(true)
    })
  })

  describe("when a category is selected", () => {
    it("shifts focus to the idea input", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={ onSubmitIdeaStub }/>)

      const ideaInput = wrapper.find("input[name='idea']")
      const categorySelect = wrapper.find("select")
      const categoryLabel = wrapper.find("label")

      expect(document.activeElement).to.equal(ideaInput.node)
      document.activeElement.blur()
      expect(document.activeElement).not.to.equal(wrapper.find("input[name='idea']").node)

      categorySelect.simulate("change")
      expect(document.activeElement).to.equal(ideaInput.node)
    })
  })

  describe("at the outset the form submit is disabled", () => {
    it("is enabled once there is an idea of 3 characters or longer", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={ onSubmitIdeaStub }/>)
      const submitButton = wrapper.find("button[type='submit']")
      const ideaInput = wrapper.find("input[name='idea']")

      expect(submitButton.prop("disabled")).to.equal(true)
      ideaInput.simulate("change", { target: { value: "farts" }})
      expect(submitButton.prop("disabled")).to.equal(false)
    })
  })
})


