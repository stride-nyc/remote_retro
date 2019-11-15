import deepFreeze from "deep-freeze"

import {
  reducer,
  actions,
} from "../../web/static/js/redux/mobile"

describe("mobile", () => {
  describe("reducer", () => {
    describe("when an action is nonexistent or unhandled", () => {
      describe("and there is no initial state", () => {
        it("returns an object with default selected category of 'happy'", () => {
          const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

          expect(reducer(undefined, unhandledAction)).to.eql({})
        })
      })

      describe("and there is initial state", () => {
        it("returns that initial state", () => {
          const initialState = { selectedCategoryTab: "happy" }
          const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

          expect(reducer(initialState, unhandledAction)).to.deep.equal(initialState)
        })
      })
    })

    describe("when the action is CATEGORY_TAB_SELECTED", () => {
      const initialState = { selectedCategoryTab: "confused" }
      deepFreeze(initialState)

      describe("when the action is CATEGORY_TAB_SELECTED", () => {
        const action = {
          type: "CATEGORY_TAB_SELECTED",
          category: "some new category",
        }

        it("transforms the intiial state, updating the selected category", () => {
          expect(reducer(initialState, action)).to.deep.equal({
            selectedCategoryTab: "some new category",
          })
        })
      })
    })
  })

  describe("actions", () => {
    describe("clearAlert", () => {
      it("creates an action indicating tab selection of the given category", () => {
        expect(
          actions.categoryTabSelected("sad")
        ).to.deep.equal({ type: "CATEGORY_TAB_SELECTED", category: "sad" })
      })
    })
  })

  describe("when the application bootstraps", () => {
    describe("when the retro is a Happy/Sad/Confused retro", () => {
      it("provides a list of lower-cased categories", () => {
        const initialState = deepFreeze([])
        const unhandledAction = { type: "SET_INITIAL_STATE", initialState: { format: "Happy/Sad/Confused" } }

        expect(reducer(initialState, unhandledAction)).to.eql({ selectedCategoryTab: "happy" })
      })
    })

    describe("when the retro is a Start/Stop/Continue retro", () => {
      it("provides a list of lower-cased categories", () => {
        const initialState = deepFreeze([])
        const unhandledAction = { type: "SET_INITIAL_STATE", initialState: { format: "Start/Stop/Continue" } }

        expect(reducer(initialState, unhandledAction)).to.eql({ selectedCategoryTab: "start" })
      })
    })
  })
})
