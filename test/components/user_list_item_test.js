import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import UserListItem from "../../web/static/js/components/user_list_item"

describe("UserListItem", () => {
  describe("passed a non-facilitator user", () => {
    const user = {
      given_name: "dylan",
      online_at: 803,
      is_facilitator: false,
    }

    it("renders a list item that does not label the user a facilitator", () => {
      const wrapper = shallow(<UserListItem user={user} />)
      expect(wrapper.text()).to.match(/dylan$/i)
    })

  })

  describe("passed a facilitator user", () => {
    const user = {
      given_name: "treezy",
      online_at: 803,
      is_facilitator: true,
    }

    it("renders a list item with text labeling the user facilitator", () => {
      const wrapper = shallow(<UserListItem user={user} />)
      expect(wrapper.text()).to.match(/treezy \(facilitator\)/i)
    })
  })

  describe("user pictures", () => {
    const user = {
      given_name: "treezy",
      online_at: 803,
      is_facilitator: true,
      picture: "http://some/image.jpg"
    }

    it("renders a list item that has a picture", () => {
      const wrapper = shallow(<UserListItem user={user} />)
      expect(wrapper.find('img.picture')).to.have.length(1)
    })

    it("renders a list item that displays an icon when a picture isn't present", () => {
      user.picture = '';
      const wrapper = shallow(<UserListItem user={user} />)
      expect(wrapper.find('i.icon')).to.have.length(1)
    })
  })
})
