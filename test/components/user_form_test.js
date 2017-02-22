import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import UserForm from "../../web/static/js/components/user_form"

describe("UserForm component", () => {
  it("invokes the function passed as the onSubmitUsername prop", () => {
    const fakeEvent = {
      stopPropagation: () => undefined,
      preventDefault: () => undefined,
    }

    const onSubmitUsernameSpy = sinon.spy(() => {})
    const wrapper = shallow(<UserForm onSubmitUsername={onSubmitUsernameSpy} />)
    wrapper.find("form").simulate("submit", fakeEvent)

    expect(onSubmitUsernameSpy.called).to.equal(true)
  })
})
