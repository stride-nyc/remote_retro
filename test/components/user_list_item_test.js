import React from "react"
import { shallow } from "enzyme"

import UserListItem from "../../web/static/js/components/user_list_item"
import AnimatedEllipsis from "../../web/static/js/components/animated_ellipsis"

const defaultUserAttrs = {
  given_name: "dylan",
  online_at: 803,
  is_facilitator: false,
  is_typing: false,
  picture: "http://some/image.jpg?sz=200",
}

describe("UserListItem", () => {
  let wrapper
  let user

  describe("passed a non-facilitator user", () => {
    const nonFacilitator = { ...defaultUserAttrs, is_facilitator: false }

    it("renders a list item that does not label the user a facilitator", () => {
      const wrapper = shallow(<UserListItem user={nonFacilitator} />)
      expect(wrapper.text()).to.match(/dylan$/i)
    })
  })

  describe("passed a facilitator user", () => {
    const facilitator = { ...defaultUserAttrs, is_facilitator: true }

    it("renders a list item with text labeling the user facilitator", () => {
      const wrapper = shallow(<UserListItem user={facilitator} />)
      expect(wrapper.text()).to.match(/dylan \(facilitator\)/i)
    })
  })

  describe("passed a user who is currently typing", () => {
    const user = { ...defaultUserAttrs, is_typing: true }

    it("renders the user with an ellipsis animation", () => {
      const wrapper = shallow(<UserListItem user={user} />)
      expect(wrapper.find(AnimatedEllipsis)).to.have.length(1)
    })
  })

  describe("passed a user who is *not* currently typing", () => {
    const user = { ...defaultUserAttrs, is_typing: false }

    it("does not render the user with an ellipsis animation", () => {
      const wrapper = shallow(<UserListItem user={user} />)
      expect(wrapper.find("i.circle.icon")).to.have.length(0)
    })
  })

  it("changes the user's image url such that its `sz` query attribute's becomes 200", () => {
    user = { ...defaultUserAttrs, picture: "http://some/image.jpg?sz=50" }
    wrapper = shallow(<UserListItem user={user} />)
    const imageSrc = wrapper.find("img.picture").prop("src")
    expect(imageSrc).to.equal("http://some/image.jpg?sz=200")
  })
})
