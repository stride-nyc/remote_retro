import React from "react"
import { shallow } from "enzyme"

import UserList from "../../web/static/js/components/user_list"
import UserListItem from "../../web/static/js/components/user_list_item"

describe("passed an array of users", () => {
  const presences = [{
    given_name: "treezy",
    online_at: 803,
    picture: "http://herpderp.com",
    token: "requiredAsUniqueKey",
  }, {
    given_name: "zander",
    online_at: 801,
    picture: "http://herpderp.com",
    token: "requiredAsADifferentUniqueKey",
  }]

  it("is renders a list item for each user", () => {
    const wrapper = shallow(<UserList presences={presences} />)
    expect(wrapper.find(UserListItem)).to.have.length(2)
  })

  it("sorts the presences by their arrival in the room, ascending", () => {
    const wrapper = mountWithConnectedSubcomponents(<UserList presences={presences} />)
    expect(wrapper.text()).to.match(/zandertreezy/i)
  })
})
