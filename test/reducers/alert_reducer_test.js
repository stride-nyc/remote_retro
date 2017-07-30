import deepFreeze from "deep-freeze"

import alert from "../../web/static/js/reducers/alert"

describe("alert reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("should return null", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(alert(undefined, unhandledAction)).to.equal(null)
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = { headerText: "derp", bodyText: "derp" }
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(alert(initialState, unhandledAction)).to.deep.equal(initialState)
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
        expect(alert(initialState, action)).to.deep.equal({
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
        expect(alert(null, action)).to.equal(null)
      })
    })

    describe("when there is a not-null initial state", () => {
      it("returns null", () => {
        expect(alert({}, action)).to.equal(null)
      })
    })
  })
})
