import { expect } from "chai"

import ideaReducer from "../../web/static/js/reducers/idea"

describe("idea reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("should return an empty array", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(ideaReducer(undefined, {})).to.deep.equal([])
        expect(ideaReducer(undefined, unhandledAction)).to.deep.equal([])
      });
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = [{ body: "we have a linter!", category: "happy", author: "Kimberly Suazo" }]
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(ideaReducer(initialState, {})).to.deep.equal(initialState)
        expect(ideaReducer(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })
})
