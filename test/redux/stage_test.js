import { reducer as stageReducer } from "../../web/static/js/redux/stage"

describe("stage reducer", () => {
  describe("unhandled actions", () => {
    describe("when there is an empty action", () => {
      describe("when no initial state is passed", () => {
        it("should return 'prime-directive'", () => {
          expect(stageReducer(undefined, {})).to.equal("prime-directive")
        })
      })

      describe("when an initial state is passed", () => {
        it("should return the initial state of 'prime-directive'", () => {
          expect(stageReducer("loveydovey", {})).to.equal("loveydovey")
        })
      })
    })
  })

  describe("handled actions", () => {
    describe("when invoked with an UPDATE_STAGE action", () => {
      describe("returns the value passed by the 'stage' attribute", () => {
        it("should return the initial state of 'prime-directive'", () => {
          const action = { type: "UPDATE_STAGE", stage: "eternal inferno" }
          expect(stageReducer("tom daley", action)).to.equal("eternal inferno")
        })
      })
    })
  })

  describe("handled actions", () => {
    describe("when invoked with a SET_INITIAL_STATE action", () => {
      it("returns the value passed as the initial state's 'stage' attribute", () => {
        const action = { type: "SET_INITIAL_STATE", initialState: { stage: "critical" } }
        expect(stageReducer("Atari Bigby", action)).to.equal("critical")
      })
    })
  })
})
