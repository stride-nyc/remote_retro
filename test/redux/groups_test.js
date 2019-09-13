import deepFreeze from "deep-freeze"

import {
  reducer as groupsReducer,
} from "../../web/static/js/redux/groups"

describe("groups reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("should return an empty array", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(groupsReducer(undefined, {})).to.deep.equal([])
        expect(groupsReducer(undefined, unhandledAction)).to.deep.equal([])
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = [{ id: 5, name: "communication" }]
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(groupsReducer(initialState, {})).to.deep.equal(initialState)
        expect(groupsReducer(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })

  describe("the handled actions", () => {
    describe("when the action is SET_INITIAL_STATE", () => {
      it("should replace the state with the groups passed in the action's inialState object", () => {
        const initialState = []
        deepFreeze(initialState)

        const groups = [{ id: 5, name: "ceremonies" }]
        const action = { type: "SET_INITIAL_STATE", initialState: { groups } }

        expect(groupsReducer(initialState, action)).to.deep.equal([...groups])
      })
    })
  })
})
