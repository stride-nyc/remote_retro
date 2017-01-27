import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import UserList from "../../web/static/js/components/user_list"

describe("passed an array of users", () => {
  const users = [{
    name: "treezy",
    online_at: 803
  }, {
    name: "zander",
    online_at: 801,
  }]

  it("is renders a list item for each user", () => {
    const wrapper = shallow(<UserList users={users} />)
    expect(wrapper.find("li")).to.have.length(2)
  })

  it("sorts the users by their arrival in the room, ascending", () => {
    const wrapper = shallow(<UserList users={users} />)
    expect(wrapper.find("li").first().text()).to.equal("zander")
  })
})
