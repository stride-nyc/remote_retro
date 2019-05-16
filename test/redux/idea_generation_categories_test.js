import deepFreeze from "deep-freeze"

import {
  reducer,
} from "../../web/static/js/redux/idea_generation_categories"

describe("idea generation categories reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("returns an empty list", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(reducer(undefined, unhandledAction)).to.eql([])
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = []
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(reducer(initialState, unhandledAction)).to.eql(initialState)
      })
    })
  })

  describe("when the application bootstraps", () => {
    describe("when the retro is a Happy/Sad/Confused retro", () => {
      it("provides a list of lower-cased categories", () => {
        const initialState = deepFreeze([])
        const unhandledAction = { type: "SET_INITIAL_STATE", initialState: { format: "Happy/Sad/Confused" } }

        expect(reducer(initialState, unhandledAction)).to.eql([
          "happy",
          "sad",
          "confused",
        ])
      })
    })

    describe("when the retro is a Start/Stop/Continue retro", () => {
      it("provides a list of lower-cased categories", () => {
        const initialState = deepFreeze([])
        const unhandledAction = { type: "SET_INITIAL_STATE", initialState: { format: "Start/Stop/Continue" } }

        expect(reducer(initialState, unhandledAction)).to.eql([
          "start",
          "stop",
          "continue",
        ])
      })
    })
  })
})
