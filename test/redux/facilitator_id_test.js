import { reducer as facilitatorId } from "../../web/static/js/redux/facilitator_id"

describe("facilitatorId reducer", () => {
  describe("unhandled actions", () => {
    describe("when there is an empty action", () => {
      describe("when no initial state is passed", () => {
        it("should return 'null'", () => {
          expect(facilitatorId(undefined, {})).to.equal(null)
        })
      })

      describe("when an initial state is passed", () => {
        it("should return that initial state", () => {
          expect(facilitatorId(31, {})).to.equal(31)
        })
      })
    })
  })

  describe("handled actions", () => {
    describe("when invoked with a SET_INITIAL_STATE action", () => {
      it("returns the value passed as the initial state's 'facilitator_id' attribute", () => {
        const action = { type: "SET_INITIAL_STATE", initialState: { facilitator_id: 990 } }
        expect(facilitatorId("Atari Bigby", action)).to.equal(990)
      })
    })
  })
})
