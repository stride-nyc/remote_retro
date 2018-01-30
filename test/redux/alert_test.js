import deepFreeze from "deep-freeze"
import FacilitationTransferInfo from "../../web/static/js/components/facilitation_transfer_info"

import {
  reducer,
  actions,
} from "../../web/static/js/redux/alert"

describe("alert", () => {
  describe("reducer", () => {
    describe("when an action is nonexistent or unhandled", () => {
      describe("and there is no initial state", () => {
        it("should return null", () => {
          const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

          expect(reducer(undefined, unhandledAction)).to.equal(null)
        })
      })

      describe("and there is initial state", () => {
        it("should return that initial state", () => {
          const initialState = { headerText: "derp", bodyText: "derp" }
          const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

          expect(reducer(initialState, unhandledAction)).to.deep.equal(initialState)
        })
      })
    })

    describe("when the action is UPDATE_STAGE", () => {
      const initialState = { headerText: "Warning!", bodyText: "You're being watched." }
      const stageConfigs = {
        daybreak: {
          alert: {
            headerText: "Lovely Header Text",
            bodyText: "Lovely Body Text",
          },
        },
        stageLackingAlertConfig: {},
      }

      deepFreeze(initialState)
      deepFreeze(stageConfigs)

      describe("when the given stage has an alert in the given configuration map", () => {
        const action = {
          type: "UPDATE_STAGE",
          stage: "daybreak",
          stageConfigs,
        }

        it("returns the alert for the given stage", () => {
          expect(reducer(initialState, action)).to.deep.equal({
            headerText: "Lovely Header Text",
            bodyText: "Lovely Body Text",
          })
        })
      })
    })

    describe("when the action is CLEAR_ALERT", () => {
      const action = { type: "CLEAR_ALERT" }

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

    describe("when the action is CHANGE_FACILITATOR", () => {
      const initialState = { headerText: "Warning!", bodyText: "You're being watched." }

      deepFreeze(initialState)

      const action = {
        type: "CHANGE_FACILITATOR",
        previousFacilitatorName: "Jane",
      }

      const expectedAlertText = {
        headerText: "Facilitation Transfer!",
        BodyComponent: () => FacilitationTransferInfo(action.previousFacilitatorName),
      }
      const actualAlertText = reducer(initialState, action)

      it("returns the alert with the facilitation transfer info", () => {
        expect(actualAlertText.headerText).to.equal(expectedAlertText.headerText)
        expect(actualAlertText.BodyComponent().toString())
          .to.equal(expectedAlertText.BodyComponent().toString())
      })
    })
  })

  describe("actions", () => {
    describe("clearAlert", () => {
      it("creates an action to clear the alert", () => {
        expect(actions.clearAlert()).to.deep.equal({ type: "CLEAR_ALERT" })
      })
    })

    describe("changeFacilitator", () => {
      it("creates an action to change alert text to facilitation transfer info", () => {
        const previousFacilitatorName = "Jane"
        expect(actions.changeFacilitator(previousFacilitatorName)).to.deep.equal({ type: "CHANGE_FACILITATOR", previousFacilitatorName })
      })
    })
  })
})
