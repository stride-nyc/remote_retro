import deepFreeze from "deep-freeze"

import {
  reducer,
  actions,
} from "../../web/static/js/redux/error"

describe("error", () => {
  describe("reducer", () => {
    describe("when an action is nonexistent or unhandled", () => {
      describe("and there is no initial state", () => {
        it("should return null", () => {
          const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

          expect(reducer(undefined, unhandledAction)).to.equal(null)
        })
      })

      describe("and there is initial state", () => {
        it("returns that initial state", () => {
          const initialState = { message: "Broken. It's all broken." }
          const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

          expect(reducer(initialState, unhandledAction)).to.deep.equal(initialState)
        })
      })
    })

    describe("when the action type is ERROR", () => {
      const initialState = deepFreeze({ message: "Something horrible has happened." })
      const action = {
        type: "SET_ERROR",
        error: { message: "new error" },
      }

      describe("when there is already an error object in state", () => {
        it("overwrites the error", () => {
          expect(reducer(initialState, action)).to.deep.equal({
            message: "new error",
          })
        })
      })
    })

    describe("when the action type is VOTE_SUBMISSION_FAILURE", () => {
      const initialState = deepFreeze({ message: "Something tragic has happened." })
      const action = {
        type: "VOTE_SUBMISSION_FAILURE",
        error: { message: "new error" },
      }

      describe("when there is already an error object in state", () => {
        it("overwrites the error", () => {
          expect(reducer(initialState, action)).to.deep.equal({
            message: "new error",
          })
        })
      })
    })

    describe("when the action is CLEAR_ERROR", () => {
      const action = { type: "CLEAR_ERROR" }

      describe("and the initial state is null", () => {
        it("returns null", () => {
          expect(reducer(null, action)).to.equal(null)
        })
      })

      describe("when there is a not-null initial state", () => {
        it("returns null", () => {
          expect(reducer({}, action)).to.equal(null)
        })
      })
    })
  })

  describe("actions", () => {
    describe("clearError", () => {
      it("creates an action to clear the error", () => {
        expect(actions.clearError()).to.deep.equal({ type: "CLEAR_ERROR" })
      })
    })
  })
})
