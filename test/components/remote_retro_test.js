import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import RemoteRetro from "../../web/static/js/components/remote_retro"
import UserForm from "../../web/static/js/components/user_form"

describe("RemoteRetro component", () => {
  it("conditionally renders the UserForm based on username state", () => {
    const wrapper = shallow(<RemoteRetro />)

    expect(wrapper.find(UserForm)).to.have.length(1)

    wrapper.setState({ username: "treezy" })

    expect(wrapper.find(UserForm)).to.have.length(0)
  })
})
