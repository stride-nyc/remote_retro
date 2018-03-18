import React from "react"
import { shallow } from "enzyme"

import { UserList } from "../../web/static/js/components/user_list"
import UserListItem from "../../web/static/js/components/user_list_item"

describe("passed an array of users", () => {
  const presences = [{
    given_name: "treezy",
    id: 5,
    online_at: 803,
    picture: "http://herpderp.com",
    token: "requiredAsUniqueKey",
  }, {
    given_name: "zander",
    id: 6,
    online_at: 801,
    picture: "http://herpderp.com",
    token: "requiredAsADifferentUniqueKey",
  }, {
    given_name: "sarah",
    id: 8,
    online_at: 1100,
    picture: "http://herpderp.com",
    token: "nekdles3",
  }]

  it("is renders a list item for each user presence", () => {
    const wrapper = shallow(<UserList presences={presences} facilitatorId={8} />)
    expect(wrapper.find(UserListItem)).to.have.length(3)
  })

  it("sorts the presences such that the facilitator is first, followed by users by arrival ascending", () => {
    const wrapper = mountWithConnectedSubcomponents(
      <UserList presences={presences} facilitatorId={8} />
    )
    expect(wrapper.text()).to.match(/sarah.*zander.*treezy/i)
  })

  describe("when the facilitatorId doesn't match any of the given presences", () => {
    it("sorts the users solely by their arrival ascending ", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <UserList presences={presences} facilitatorId={10} />
      )

      expect(wrapper.find(UserListItem)).to.have.length(3)
      expect(wrapper.html()).to.match(/zander.*treezy.*sarah/i)
    })
  })

  describe("when the presences list is empty", () => {
    it("executes a null render", () => {
      const wrapper = shallow(<UserList presences={[]} facilitatorId={8} />)
      expect(wrapper.html()).to.equal(null)
    })
  })
})
