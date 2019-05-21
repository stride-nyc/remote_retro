import StageConfig from "../../web/static/js/services/stage_config"
import stageConfigs from "../../web/static/js/configs/stage_configs"

describe("StageConfig.retrieveFor", () => {
  const primeDirective = "prime-directive"
  const originalVal = stageConfigs[primeDirective]
  const fakeValueForTest = { nextStage: "voting" }

  afterEach(() => {
    stageConfigs[primeDirective] = originalVal
  })

  describe("when the given stage maps to a configuration", () => {
    beforeEach(() => {
      stageConfigs[primeDirective] = fakeValueForTest
    })

    it("retrieves the value", () => {
      expect(StageConfig.retrieveFor(primeDirective)).to.eql(fakeValueForTest)
    })
  })

  describe("when the configuration store lacks a value for the provided stage", () => {
    beforeEach(() => {
      delete stageConfigs[primeDirective]
    })

    it("throws an error", () => {
      expect(() => {
        StageConfig.retrieveFor(primeDirective)
      }).to.throw()
    })
  })
})
