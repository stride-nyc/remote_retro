import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaSubmissionForm from "../../web/static/js/components/idea_submission_form"
describe("IdeaSubmissionForm component", () => {
  let wrapper

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

    describe("when the category input lacks focus", () => {
      beforeEach(() => {
        const onSubmitIdeaStub = () => {}
        wrapper = mount(<IdeaSubmissionForm onIdeaSubmission={ onSubmitIdeaStub }/>)
        wrapper.find("input[name='idea']").node.focus()
      })

      it("resets the focus to the category input", () => {
        const selectCategoryInput = wrapper.find("select")

        expect(document.activeElement).not.to.equal(selectCategoryInput.node)
        wrapper.simulate("submit", fakeEvent)
        expect(document.activeElement).to.equal(selectCategoryInput.node)
      })
    })
  })
})
