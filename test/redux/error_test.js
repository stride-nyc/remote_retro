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

    describe("when the action type is GROUP_UPDATE_REJECTED", () => {
      const initialState = null
      const action = { type: "GROUP_UPDATE_REJECTED" }

      it("sets a descriptive error message", () => {
        expect(reducer(initialState, action).message).to.match(/group update failed\. please try again\./i)
      })
    })

    describe("when the action type is IDEA_DELETION_REJECTED", () => {
      const initialState = null
      const action = { type: "IDEA_DELETION_REJECTED" }

      it("sets a descriptive error message", () => {
        expect(reducer(initialState, action).message).to.match(/idea deletion failed\. please try again\./i)
      })
    })

    describe("when the action type is IDEA_SUBMISSION_REJECTED", () => {
      const initialState = null
      const action = { type: "IDEA_SUBMISSION_REJECTED" }

      it("sets a descriptive error message", () => {
        expect(reducer(initialState, action).message).to.match(/idea submission failed\. please try again\./i)
      })
    })

    describe("when the action type is IDEA_UPDATE_REJECTED", () => {
      const initialState = null
      const action = { type: "IDEA_UPDATE_REJECTED" }

      describe("when there is already an error object in state", () => {
        it("sets a descriptive error message", () => {
          expect(reducer(initialState, action).message).to.match(/idea update failed\. please try again\./i)
        })
      })
    })

    describe("when the action type is VOTE_SUBMISSION_REJECTED", () => {
      const initialState = null
      const action = { type: "VOTE_SUBMISSION_REJECTED" }

      it("sets a descriptive error message", () => {
        expect(reducer(initialState, action).message).to.match(/vote submission failed\. please try again\./i)
      })
    })

    describe("when the action type is VOTE_RETRACTION_REJECTED", () => {
      const action = { type: "VOTE_RETRACTION_REJECTED" }
      const initialState = null

      it("sets a descriptive error message", () => {
        expect(reducer(initialState, action).message).to.match(/vote retraction/i)
      })
    })

    describe("when the action type is RETRO_UPDATE_REJECTED", () => {
      const initialState = null
      const action = { type: "RETRO_UPDATE_REJECTED" }

      it("sets a descriptive error message", () => {
        expect(reducer(initialState, action)).to.deep.equal({
          message: "Retro update failed. Please try again.",
        })
      })
    })

    describe("when the action type is USER_UPDATE_REJECTED", () => {
      const initialState = null
      const action = { type: "USER_UPDATE_REJECTED" }

      it("sets a descriptive error message", () => {
        expect(reducer(initialState, action)).to.deep.equal({
          message: "Update failed. Please try again.",
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
