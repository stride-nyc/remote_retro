import deepFreeze from "deep-freeze"

import alertConfig from "../../web/static/js/reducers/alert_config"

describe("alertConfig reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("should return null", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(alertConfig(undefined, unhandledAction)).to.equal(null)
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = { headerText: "derp", bodyText: "derp" }
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(alertConfig(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })

  describe("when the action is UPDATE_STAGE", () => {
    const initialState = { headerText: "Warning!", bodyText: "You're being watched." }
    const stageProgressionConfigs = {
      daybreak: {
        alertConfig: {
          headerText: "Lovely Header Text",
          bodyText: "Lovely Body Text",
        }
      },
      stageLackingAlertConfig: {},
    }

    deepFreeze(initialState)
    deepFreeze(stageProgressionConfigs)

    describe("when the given stage has an alertConfig in the given configuration map", () => {
      const action = {
        type: "UPDATE_STAGE",
        stage: "daybreak",
        stageProgressionConfigs,
      }

      it("returns the alertConfig for the given stage", () => {
        expect(alertConfig(initialState, action)).to.deep.equal({
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
        expect(alertConfig(null, action)).to.equal(null)
      })
    })

    describe("when there is a not-null initial state", () => {
      it("returns null", () => {
        expect(alertConfig({}, action)).to.equal(null)
      })
    })
  })
})
