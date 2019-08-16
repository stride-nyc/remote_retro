import deepFreeze from "deep-freeze"
import sinon from "sinon"
import NewFacilitator from "../../web/static/js/components/new_facilitator"
import StageConfig from "../../web/static/js/services/stage_config"

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

    describe("when the retro is advanced to a new stage", () => {
      let stub
      let resultingConfig

      beforeEach(() => {
        stub = sinon.stub(StageConfig, "retrieveFor")
          .returns({ anotherKey: "value", arrivalAlert: { one: "two" } })

        const retroChanges = {
          stage: "idea-generation",
        }
        const action = { type: "RETRO_STAGE_PROGRESSION_COMMITTED", retroChanges }

        resultingConfig = reducer(undefined, action)
      })

      afterEach(() => {
        stub.restore()
      })

      it("invokes StageConfig.retrieveFor", () => {
        expect(stub).calledWith({ stage: "idea-generation" })
      })

      it("returns the alert value from the result of StageConfig.retrieveFor", () => {
        expect(resultingConfig).to.eql({ one: "two" })
      })
    })

    describe("when the action is SHOW_STAGE_HELP", () => {
      const initialState = { headerText: "Warning!", bodyText: "You're being watched." }
      const help = {
        headerText: "I need help!",
        bodyText: "Tell me what to do",
      }

      deepFreeze(initialState)

      const action = {
        type: "SHOW_STAGE_HELP",
        help,
      }

      it("it replaces the state with the given configuration", () => {
        expect(reducer(initialState, action)).to.deep.equal({
          headerText: "I need help!",
          bodyText: "Tell me what to do",
        })
      })
    })

    describe("when the action is CURRENT_USER_HAS_BECOME_FACILITATOR", () => {
      const action = { type: "CURRENT_USER_HAS_BECOME_FACILITATOR" }
      const initialState = null

      it("returns configs for the NewFacilitator alert", () => {
        expect(reducer(initialState, action)).to.eql({
          headerText: "You've been granted the facilitatorship!",
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
