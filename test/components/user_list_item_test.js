import React from "react"
import { shallow } from "enzyme"

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
    let user
    let wrapper

    context("when the user has a picture attribute", () => {
      beforeEach(() => {
        user = { picture: "http://some/image.jpg?sz=50" }
        wrapper = shallow(<UserListItem user={user} />)
      })

      it("renders a list item that has a picture", () => {
        expect(wrapper.find("img.picture")).to.have.length(1)
      })

      it("changes the `sz` query attribute's value from 50 to 200", () => {
        const imageSrc = wrapper.find("img.picture").prop("src")
        expect(imageSrc).to.equal("http://some/image.jpg?sz=200")
      })
    })

    context("when the user lacks a picture attribute", () => {
      beforeEach(() => {
        user = { picture: undefined }
        wrapper = shallow(<UserListItem user={user} />)
      })

      it("renders a list item that displays an icon", () => {
        expect(wrapper.find("i.icon")).to.have.length(1)
      })
    })
  })
})
