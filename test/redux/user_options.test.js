import {
  reducer,
  actions,
} from "../../web/static/js/redux/user_options"

describe("user options", () => {
  describe("reducer", () => {
    describe("when an action is nonexistent or unhandled", () => {
      describe("and there is no initial state", () => {
        it("should return default initial state", () => {
          const unhandledAction = { type: "SOMEUNHANDLEDACTION" }

          expect(reducer(undefined, unhandledAction)).toEqual({
            highContrastOn: false,
          })
        })
      })

      describe("and there is initial state", () => {
        it("returns that initial state", () => {
          const initialState = { highContrastOn: true }
          const unhandledAction = { type: "SOMEUNHANDLEDACTION" }

          expect(reducer(initialState, unhandledAction)).toEqual(initialState)
        })
      })
    })

    describe("when the action is TOGGLE_HIGH_CONTRAST", () => {
      const action = { type: "TOGGLE_HIGH_CONTRAST" }

      describe("and highContrastOn is true", () => {
        it("returns highContrastOn as false", () => {
          expect(reducer({ highContrastOn: true }, action)).toEqual({ highContrastOn: false })
        })
      })

      describe("and highContrastOn is false", () => {
        it("returns highContrastOn as true", () => {
          expect(reducer({ highContrastOn: false }, action)).toEqual({ highContrastOn: true })
        })
      })
    })
  })

  describe("actions", () => {
    describe("toggleHighContrastOn", () => {
      it("creates an action to toggle the value of highContrastOn", () => {
        expect(actions.toggleHighContrastOn()).toEqual({ type: "TOGGLE_HIGH_CONTRAST" })
      })
    })
  })
})
