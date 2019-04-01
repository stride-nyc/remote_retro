import deepFreeze from "deep-freeze"
import NewFacilitator from "../../web/static/js/components/new_facilitator"

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

    describe("when the action is RETRO_UPDATE_COMMITTED", () => {
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
          type: "RETRO_UPDATE_COMMITTED",
          retro: {
            stage: "daybreak",
          },
          stageConfigs,
        }

        it("returns the alert for the given stage", () => {
          expect(reducer(initialState, action)).to.deep.equal({
            headerText: "Lovely Header Text",
            bodyText: "Lovely Body Text",
          })
        })
      })

      describe("when the stage isn't included in the retroChanges", () => {
        const action = {
          type: "RETRO_UPDATE_COMMITTED",
          retroChanges: {
            facilitator_id: 42,
          },
          stageConfigs,
        }

        it("doesn't change the state", () => {
          expect(reducer(initialState, action)).to.deep.equal(null)
        })
      })
    })

    describe("when the action is SHOW_STAGE_HELP", () => {
      const initialState = { headerText: "Warning!", bodyText: "You're being watched." }
      const stageConfigs = {
        daybreak: {
          help: {
            headerText: "I need help!",
            bodyText: "Tell me what to do",
          },
        },
        nightfall: {
          no_help: {},
        },
        stageLackingHelpConfig: {},
      }

      deepFreeze(initialState)
      deepFreeze(stageConfigs)

      describe("when the given stage has a help in the given configuration map", () => {
        const action = {
          type: "SHOW_STAGE_HELP",
          retro: {
            stage: "daybreak",
          },
          stageConfigs,
        }

        it("returns the help for the given stage", () => {
          expect(reducer(initialState, action)).to.deep.equal({
            headerText: "I need help!",
            bodyText: "Tell me what to do",
          })
        })
      })

      describe("when the given stage does NOT have a help in the given configuration map", () => {
        const action = {
          type: "SHOW_STAGE_HELP",
          retro: {
            stage: "nightfall",
          },
          stageConfigs,
        }

        it("returns a null for the given stage", () => {
          expect(reducer(initialState, action)).to.deep.equal(null)
        })
      })
    })

    describe("when the action is NEW_FACILITATOR", () => {
      const action = { type: "NEW_FACILITATOR" }
      const initialState = null

      it("returns configs for the NewFacilitator alert", () => {
        expect(reducer(initialState, action)).to.eql({
          headerText: "New Facilitator",
          BodyComponent: NewFacilitator,
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
  })

  describe("actions", () => {
    describe("clearAlert", () => {
      it("creates an action to clear the alert", () => {
        expect(actions.clearAlert()).to.deep.equal({ type: "CLEAR_ALERT" })
      })
    })
  })
})
