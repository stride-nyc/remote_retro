import { reducer as insertedAtReducer } from "../../web/static/js/redux/inserted_at"

describe("insertedAt reducer", () => {
  describe("unhandled actions", () => {
    describe("when there is an empty action", () => {
      describe("when no initial state is passed", () => {
        it("should return an initial state of null", () => {
          expect(insertedAtReducer(undefined, { type: "unknown" })).to.equal(null)
        })
      })

      describe("when an initial state is passed", () => {
        it("should return the initial state of 'prime-directive'", () => {
          expect(insertedAtReducer("2017-04-14T17:30:10", {})).to.equal("2017-04-14T17:30:10")
        })
      })
    })
  })

  describe("handled actions", () => {
    describe("when invoked with a SET_INITIAL_STATE action", () => {
      it("returns the persisted state's 'inserted_at' value", () => {
        const action = { type: "SET_INITIAL_STATE", initialState: { inserted_at: "holy mother of jeebus" } }
        expect(insertedAtReducer(undefined, action)).to.equal("holy mother of jeebus")
      })
    })
  })
})
