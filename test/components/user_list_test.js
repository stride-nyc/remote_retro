import React from "react"
import { shallow } from "enzyme"

import { UserList } from "../../web/static/js/components/user_list"
import UserListItem from "../../web/static/js/components/user_list_item"

describe("passed an array of users", () => {
  const presences = [{
    given_name: "treezy",
    is_facilitator: false,
    id: 5,
    online_at: 803,
    picture: "http://herpderp.com",
    token: "requiredAsUniqueKey",
  }, {
    given_name: "zander",
    is_facilitator: false,
    id: 6,
    online_at: 801,
    picture: "http://herpderp.com",
    token: "requiredAsADifferentUniqueKey",
  }, {
    given_name: "sarah",
    is_facilitator: true,
    id: 8,
    online_at: 1100,
    picture: "http://herpderp.com",
    token: "nekdles3",
  }]

  it("is renders a list item for each user presence", () => {
    const wrapper = shallow(<UserList wrap={false} presences={presences} />)
    expect(wrapper.find(UserListItem)).to.have.length(3)
  })

  it("sorts the presences such that the facilitator is first, followed by users by arrival ascending", () => {
    const wrapper = shallow(<UserList wrap={false} presences={presences} />)
    const givenNames = wrapper.find(UserListItem).map(userListItem => userListItem.prop("user").given_name)
    expect(givenNames).to.eql(["sarah", "zander", "treezy"])
  })

  describe("when none of the users passed is a facilitator", () => {
    const nonFacilitatorPresences = presences.map(presence => ({
      ...presence,
      is_facilitator: false,
    }))

    it("sorts the users solely by their arrival ascending ", () => {
      const wrapper = shallow(<UserList wrap={false} presences={nonFacilitatorPresences} />)
      const givenNames = wrapper.find(UserListItem).map(userListItem => userListItem.prop("user").given_name)
      expect(givenNames).to.eql(["zander", "treezy", "sarah"])
    })
  })

  describe("when wrap is true", () => {
    it("displays modified user list", () => {
      const wrapper = shallow(<UserList wrap presences={presences} />)
      expect(wrapper.find("ul").hasClass("wrap")).to.equal(true)
    })
  })

  describe("when the presences list is empty", () => {
    it("executes a null render", () => {
      const wrapper = shallow(<UserList wrap={false} presences={[]} />)
      expect(wrapper.html()).to.equal(null)
    })
  })
})
