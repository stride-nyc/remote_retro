import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaSubmissionForm from "../../web/static/js/components/idea_submission_form"

describe("IdeaSubmissionForm component", () => {
  it("invokes the function passed as the onSubmitUsername prop", () => {
    const fakeEvent = {
      stopPropagation: ()=> undefined,
      preventDefault: ()=> undefined,
    }

    const onSubmitIdeaSpy = sinon.spy(() => {})
    const wrapper = shallow(<IdeaSubmissionForm onIdeaSubmission={ onSubmitIdeaSpy }/>)
    wrapper.find("form").simulate("submit", fakeEvent)

    expect(onSubmitIdeaSpy.called).to.equal(true)
  })
})
