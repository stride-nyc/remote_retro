import uiReducer, { initialState } from "../../web/static/js/reducers/idea"

describe("ui reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no state provided", () => {
      it("should return the initialState object", () => {
        const unhandledAction = { type: "WACKY" }

        expect(uiReducer(undefined, {})).to.deep.equal(initialState)
        expect(uiReducer(undefined, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })
})
