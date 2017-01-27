import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import Retro from "../../web/static/js/components/retro"
import UserForm from "../../web/static/js/components/user_form"

describe("Retro component", () => {
  it("conditionally renders the UserForm based on username state", () => {
    const wrapper = shallow(<Retro />)

    expect(wrapper.find(UserForm)).to.have.length(1)

    wrapper.setState({ user: "treezy" })

    expect(wrapper.find(UserForm)).to.have.length(0)
  })
})
