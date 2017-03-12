import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaSubmissionForm from "../../web/static/js/components/idea_submission_form"

describe("IdeaSubmissionForm component", () => {
  let wrapper

  const onSubmitIdeaStub = () => {}
  const onToggleActionItemStub = () => {}
  const fakeEvent = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined,
  }

  describe("on submit", () => {
    it("invokes the function passed as the onIdeaSubmission prop", () => {
      const onSubmitIdeaSpy = sinon.spy(() => {})
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaSpy} onToggleActionItem={onToggleActionItemStub}/>)

      wrapper.simulate("submit", fakeEvent)

      expect(onSubmitIdeaSpy.called).to.equal(true)
    })
  })

  describe("when a category is selected", () => {
    it("shifts focus to the idea input", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemStub}/>)

      const ideaInput = wrapper.find("input[name='idea']")
      const categorySelect = wrapper.find("select")

      expect(document.activeElement).to.equal(ideaInput.node)
      document.activeElement.blur()
      expect(document.activeElement).not.to.equal(wrapper.find("input[name='idea']").node)

      categorySelect.simulate("change")
      expect(document.activeElement).to.equal(ideaInput.node)
    })
  })

  describe("at the outset the form submit is disabled", () => {
    it("is enabled once there is an idea of 3 characters or longer", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemStub}/>)
      const submitButton = wrapper.find("button[type='submit']")
      const ideaInput = wrapper.find("input[name='idea']")

      expect(submitButton.prop("disabled")).to.equal(true)
      ideaInput.simulate("change", { target: { value: "farts" } })
      expect(submitButton.prop("disabled")).to.equal(false)
    })
  })

  describe("action items toggle", () => {
    it("is false on render", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemStub} />)
      const actionItemsToggle = wrapper.find("input[type='checkbox']")

      expect(actionItemsToggle.getNode().checked).to.equal(false)
    })

    it("invokes the method passed as onToggleActionItem on change", () => {
      const onToggleActionItemSpy = sinon.spy()

      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemSpy} />)

      const actionItemsToggle = wrapper.find("input[type='checkbox']")
      actionItemsToggle.simulate("change")
      expect(onToggleActionItemSpy.called).to.equal(true)
    })

    it("toggles the state of showCategories", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemStub} />)
      expect(wrapper.state("showCategories")).to.equal(true)

      const actionItemsToggle = wrapper.find("input[type='checkbox']")
      actionItemsToggle.simulate("change")
      expect(wrapper.state("showCategories")).to.equal(false)
    })

    it("toggles the state of categories between prior selection and 'action-item'", () => {
      wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={onSubmitIdeaStub} onToggleActionItem={onToggleActionItemStub} />)
      expect(wrapper.state("category")).to.equal("happy")

      const actionItemsToggle = wrapper.find("input[type='checkbox']")
      actionItemsToggle.simulate("change")
      expect(wrapper.state("category")).to.equal("action-item")
    })
  })
})
