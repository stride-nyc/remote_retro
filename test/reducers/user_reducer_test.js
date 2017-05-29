import { expect } from "chai"

import userReducer from "../../web/static/js/reducers/user"

describe("user reducer", () => {
  const users = [{ given_name: "Tiny Rick" }, { given_name: "Morty" }]

  describe("when no new state is passed", () => {
    it("should return the initial state of an empty array", () => {
      expect(userReducer(undefined, {})).to.deep.equal([])
    })
  })

  describe("when there are no users", () => {
    const action = { type: "ADD_USERS", users }

    it("should handle ADD_USERS", () => {
      expect(userReducer([], action)).to.deep.equal(users)
    })
  })

  describe("when there are existing users", () => {
    const action = { type: "ADD_USERS", users }

    it("should handle ADD_USERS", () => {
      expect(userReducer([{ given_name: "Morty" }], action)).to.deep.equal(users)
    })
  })

  describe("when the action is unhandled", () => {
    const action = { type: "IHAVENOIDEAWHATSHAPPENING" }

    it("returns the previous state", () => {
      expect(userReducer([{ given_name: "Morty" }], action)).to.deep.equal([{ given_name: "Morty" }])
    })
  })
})
