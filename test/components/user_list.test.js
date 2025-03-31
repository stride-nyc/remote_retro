/* eslint-disable react/prop-types */
import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import { UserList } from "../../web/static/js/components/user_list"

jest.mock("../../web/static/js/components/user_list_item", () => {
  return function MockUserListItem({ user }) {
    return <div data-testid="user-list-item" data-user-name={user.given_name}>{user.given_name}</div>
  }
})

describe("UserList", () => {
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

  it("renders a list item for each user presence", () => {
    render(<UserList wrap={false} presences={presences} />)
    const userListItems = screen.getAllByTestId("user-list-item")
    expect(userListItems).toHaveLength(3)
  })

  it("sorts the presences such that the facilitator is first, followed by users by arrival ascending", () => {
    render(<UserList wrap={false} presences={presences} />)
    const userListItems = screen.getAllByTestId("user-list-item")
    const givenNames = userListItems.map(item => item.getAttribute("data-user-name"))
    expect(givenNames).toEqual(["sarah", "zander", "treezy"])
  })

  describe("when none of the users passed is a facilitator", () => {
    const nonFacilitatorPresences = presences.map(presence => ({
      ...presence,
      is_facilitator: false,
    }))

    it("sorts the users solely by their arrival ascending", () => {
      render(<UserList wrap={false} presences={nonFacilitatorPresences} />)
      const userListItems = screen.getAllByTestId("user-list-item")
      const givenNames = userListItems.map(item => item.getAttribute("data-user-name"))
      expect(givenNames).toEqual(["zander", "treezy", "sarah"])
    })
  })

  describe("when wrap is true", () => {
    it("displays modified user list", () => {
      render(<UserList wrap presences={presences} />)
      const userList = screen.getByRole("list")
      expect(userList).toHaveClass("wrap")
    })
  })

  describe("when the presences list is empty", () => {
    it("executes a null render", () => {
      const { container } = render(<UserList wrap={false} presences={[]} />)
      expect(container.firstChild).toBeNull()
    })
  })
})
