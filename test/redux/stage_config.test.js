// Mock the Redux store to prevent "No reducer provided for key 'stageConfig'" error
import {
  reducer as stageConfigReducer
} from "../../web/static/js/redux/stage_config"

import StageConfig from "../../web/static/js/services/stage_config"

jest.mock("../../web/static/js/redux/index", () => ({
  reducer: jest.fn(),
  actions: {},
  selectors: {},
}))

describe("stageConfig reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("returns nothing", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(stageConfigReducer(undefined, unhandledAction)).toBe(null)
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = { confirmationMessageHTML: "You sure you wanna proceed to voting?" }
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(stageConfigReducer(initialState, unhandledAction)).toEqual(initialState)
      })
    })
  })

  describe("the handled actions", () => {
    describe("when invoked with a SET_INITIAL_STATE action", () => {
      let mockRetrieveFor
      let resultingConfig

      beforeEach(() => {
        mockRetrieveFor = jest.spyOn(StageConfig, "retrieveFor").mockReturnValue({ keyFromStub: "value", alert: {} })
        const actionInitialState = {
          stage: "prime-directive",
          format: "Happy/Sad/Confused",
        }
        const action = { type: "SET_INITIAL_STATE", initialState: actionInitialState }

        resultingConfig = stageConfigReducer(undefined, action)
      })

      afterEach(() => {
        mockRetrieveFor.mockRestore()
      })

      it("invokes StageConfig.retrieveFor with the format and initial stage", () => {
        expect(mockRetrieveFor).toHaveBeenCalledWith({ format: "Happy/Sad/Confused", stage: "prime-directive" })
      })

      it("returns an object based on the config returned by StageConfig.retrieveFor", () => {
        expect(resultingConfig).toHaveProperty("keyFromStub")
      })

      it("omits alert configuration", () => {
        expect(resultingConfig).not.toHaveProperty("alert")
      })
    })

    describe("when the retro stage is advanced", () => {
      let mockRetrieveFor
      let resultingConfig

      beforeEach(() => {
        mockRetrieveFor = jest.spyOn(StageConfig, "retrieveFor").mockReturnValue({ anotherKey: "value", alert: {} })
        const payload = {
          retro: {
            stage: "idea-generation",
          },
        }
        const action = { type: "RETRO_STAGE_PROGRESSION_COMMITTED", payload }

        resultingConfig = stageConfigReducer(undefined, action)
      })

      afterEach(() => {
        mockRetrieveFor.mockRestore()
      })

      it("invokes StageConfig.retrieveFor with the new stage", () => {
        expect(mockRetrieveFor).toHaveBeenCalledWith({ stage: "idea-generation" })
      })

      it("returns a configuration object based on the return of the collaborator", () => {
        expect(resultingConfig).toHaveProperty("anotherKey")
      })

      it("omits the alert configuration", () => {
        expect(resultingConfig).not.toHaveProperty("alert")
      })
    })
  })
})
