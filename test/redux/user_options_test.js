import { reducer } from "../../web/static/js/redux/user_options"

describe("user options", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("should return default initial state", () => {
        const unhandledAction = { type: "SOMEUNHANDLEDACTION" }

        expect(reducer(undefined, unhandledAction)).to.deep.equal({
          highContrastOn: false,
        })
      })
    })
    describe("and there is initial state", () => {
      it("returns that initial state", () => {
        const initialState = { highContrastOn: true }
        const unhandledAction = { type: "SOMEUNHANDLEDACTION" }

        expect(reducer(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })
})
