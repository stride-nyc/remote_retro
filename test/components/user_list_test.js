import React from "react"
import { shallow, render } from "enzyme"
import { expect } from "chai"

import UserList from "../../web/static/js/components/user_list"
import UserListItem from "../../web/static/js/components/user_list_item"

describe("passed an array of users", () => {
  const users = [{
    name: "treezy",
    online_at: 803,
  }, {
    name: "zander",
    online_at: 801,
  }]

  it("is renders a list item for each user", () => {
    const wrapper = shallow(<UserList users={users} />)
    expect(wrapper.find(UserListItem)).to.have.length(2)
  })

  it("sorts the users by their arrival in the room, ascending", () => {
    const wrapper = render(<UserList users={users} />)
    expect(wrapper.text()).to.match(/zander\(Facilitator\)treezy/i)
  })

  it("labels the user with the oldest session as '(Facilitator)'", () => {
    const wrapper = render(<UserList users={users} />)
    console.log(wrapper.debug)
    expect(wrapper.text()).to.match(/zander\(Facilitator\)treezy/i)
  })

  describe("when existing facilitator leaves the room", () => {
    it("labels the user with the next oldest session as '(Facilitator)'", () => {
      users.pop()
      const wrapper = render(<UserList users={users} />)
      expect(wrapper.text()).to.match(/treezy\(Facilitator\)/i)
    })
  })
})
