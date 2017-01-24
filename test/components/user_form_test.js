import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import UserForm from "../../web/static/js/components/user_form"

describe("UserForm component", () => {
  it("invokes the function passed as the submitAction prop", () => {
    const fakeEvent = {
      stopPropagation: ()=> undefined,
      preventDefault: ()=> undefined,
    }

    const submitActionSpy = sinon.spy(() => {})
    const wrapper = shallow(<UserForm submitAction={submitActionSpy}/>)
    wrapper.find("form").simulate("submit", fakeEvent)

    expect(submitActionSpy.called).to.equal(true)
  })
})
