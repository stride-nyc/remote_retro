import uiReducer, { initialState } from "../../web/static/js/reducers/ui"

describe("ui reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no state provided", () => {
      it("should return the initialState object", () => {
        const unhandledAction = { type: "WACKY" }

        expect(uiReducer(undefined, {})).to.deep.equal(initialState)
        expect(uiReducer(undefined, unhandledAction)).to.deep.equal(initialState)
      })
    })

    describe("and there is state provided", () => {
      it("should return that state", () => {
        const state = { submitIdeaPromptPointerVisible: false }
        const unhandledAction = { type: "WACKY" }

        expect(uiReducer(state, {})).to.deep.equal(state)
        expect(uiReducer(state, unhandledAction)).to.deep.equal(state)
      })
    })
  })

  describe("the handled actions", () => {
    describe("when the action is TOGGLE_SUBMIT_IDEA_PROMPT_POINTER", () => {
      it("should update the value of submitIdeaPromptPointerVisible", () => {
        const action = { type: "TOGGLE_SUBMIT_IDEA_PROMPT_POINTER", value: false }
        const expectedResult = { submitIdeaPromptPointerVisible: false }
        expect(uiReducer(undefined, action)).to.deep.equal(expectedResult)
      })
    })
  })
})
