import deepFreeze from "deep-freeze"

import userReducer from "../../web/static/js/reducers/user"

describe("user reducer", () => {
  describe("when there is an empty action", () => {
    describe("when no new state is passed", () => {
      it("should return the initial state of an empty array", () => {
        expect(userReducer(undefined, {})).to.deep.equal([])
      })
    })
  })

  describe("when action is ADD_USERS", () => {
    const users = [{ given_name: "Tiny Rick" }, { given_name: "Morty" }]


    describe("when there is no existing state", () => {
      const action = { type: "ADD_USERS", users }

      it("should add users specified in action to state", () => {
        expect(userReducer([], action)).to.deep.equal(users)
      })
    })

    describe("when there is existing state", () => {
      const action = { type: "ADD_USERS", users }

      it("should add new users specified in action to state", () => {
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

  describe("When action is UPDATE_USER", () => {
    const userToken = "abc123"
    const newAttributes = { age: 70 }
    const action = { type: "UPDATE_USER", userToken, newAttributes }
    const initialState = [{ token: "abc123", name: "Tiny Rick", age: 180 }, { token: "zzz444", name: "Morty", age: 15 }]
    deepFreeze(initialState)
    const newState = userReducer(initialState, action)

    it("should update user with matching token with new attributes", () => {
      expect(newState).to.deep.equal([{ token: "abc123", name: "Tiny Rick", age: 70 }, { token: "zzz444", name: "Morty", age: 15 }])
    })
  })
})
