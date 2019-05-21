import sinon from "sinon"

import {
  reducer as stageConfigReducer
} from "../../web/static/js/redux/stage_config"

import StageConfig from "../../web/static/js/services/stage_config"

describe("stageConfig reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("returns nothing", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(stageConfigReducer(undefined, unhandledAction)).to.equal(null)
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = { confirmationMessage: "You sure you wanna proceed to voting?" }
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(stageConfigReducer(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })

  describe("the handled actions", () => {
    describe("when invoked with a SET_INITIAL_STATE action", () => {
      let stub
      let resultingConfig

      beforeEach(() => {
        stub = sinon.stub(StageConfig, "retrieveFor").returns({ keyFromStub: "value", alert: {} })
        const actionInitialState = {
          stage: "prime-directive",
        }
        const action = { type: "SET_INITIAL_STATE", initialState: actionInitialState }

        resultingConfig = stageConfigReducer(undefined, action)
      })

      afterEach(() => {
        stub.restore()
      })

      it("invokes StageConfig.retrieveFor with the initial stage", () => {
        expect(stub).calledWith("prime-directive")
      })

      it("returns an object based on the config returned by StageConfig.retrieveFor", () => {
        expect(resultingConfig).to.have.property("keyFromStub")
      })

      it("omits alert configuration", () => {
        expect(resultingConfig).to.not.have.property("alert")
      })
    })

    describe("when the retro stage is advanced", () => {
      let stub
      let resultingConfig

      beforeEach(() => {
        stub = sinon.stub(StageConfig, "retrieveFor").returns({ anotherKey: "value", alert: {} })
        const retroChanges = {
          stage: "idea-generation",
        }
        const action = { type: "RETRO_STAGE_PROGRESSION_COMMITTED", retroChanges }

        resultingConfig = stageConfigReducer(undefined, action)
      })

      afterEach(() => {
        stub.restore()
      })

      it("invokes StageConfig.retrieveFor with the new stage", () => {
        expect(stub).calledWith("idea-generation")
      })

      it("returns a configuration object based on the return of the collaborator", () => {
        expect(resultingConfig).to.have.property("anotherKey")
      })

      it("omits the alert configuration", () => {
        expect(resultingConfig).to.not.have.property("alert")
      })
    })
  })
})
