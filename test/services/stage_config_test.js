import StageConfig from "../../web/static/js/services/stage_config"
import formats from "../../web/static/js/configs/formats"

describe("StageConfig.retrieveFor", () => {
  const primeDirective = "prime-directive"
  const happySadConfused = "Happy/Sad/Confused"
  const originalVal = formats[happySadConfused][primeDirective]
  const fakeValueForTest = {
    nextStage: "voting",
  }

  beforeEach(() => {
    formats[happySadConfused][primeDirective] = fakeValueForTest
  })

  afterEach(() => {
    formats[happySadConfused][primeDirective] = originalVal
  })

  describe("when the given retro format + stage maps to a configuration object", () => {
    it("retrieves the value", () => {
      expect(
        StageConfig.retrieveFor({ format: happySadConfused, stage: primeDirective })
      ).to.eql(fakeValueForTest)
    })
  })

  describe("when the given retro format doesn't exist", () => {
    it("throws", () => {
      expect(() => {
        StageConfig.retrieveFor({ format: "Non-Exiztant Format", stage: primeDirective })
      }).to.throw("No format configuration found for 'Non-Exiztant Format'.")
    })
  })

  describe("when given an invalid retro stage", () => {
    it("throws an error", () => {
      expect(() => {
        StageConfig.retrieveFor({ format: happySadConfused, stage: "prince time!" })
      }).to.throw("No stage configuration found for 'prince time!'.")
    })
  })

  describe("when the given retro format doesn't exist", () => {
    it("throws", () => {
      expect(() => {
        StageConfig.retrieveFor({ format: "Non-Exiztant Format", stage: primeDirective })
      }).to.throw("No format configuration found for 'Non-Exiztant Format'.")
    })
  })

  describe("repeated uses of the module", () => {
    let UnCachedStageConfig

    beforeEach(() => {
      const requireUncached = module => {
        delete require.cache[require.resolve(module)]
        return require(module) // eslint-disable-line
      }

      UnCachedStageConfig = requireUncached("../../web/static/js/services/stage_config").default
    })

    describe("when invoked without a format for the first time", () => {
      it("throws an error", () => {
        expect(() => {
          UnCachedStageConfig.retrieveFor({ stage: "prince time!" })
        }).to.throw()
      })
    })

    describe("when already invoked with a format", () => {
      beforeEach(() => {
        UnCachedStageConfig.retrieveFor({ format: happySadConfused, stage: primeDirective })
      })

      it("can be invoked *without* a format and still retrieve the needed value", () => {
        expect(
          UnCachedStageConfig.retrieveFor({ stage: primeDirective })
        ).to.eql(fakeValueForTest)
      })
    })
  })
})
