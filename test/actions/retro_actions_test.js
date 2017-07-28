import * as actionCreators from "../../web/static/js/actions/retro"

describe("updateStage", () => {
  it("creates an action to update the retro's stage", () => {
    const newStage = "newSlang"

    expect(actionCreators.updateStage(newStage)).to.deep.equal({
      type: "UPDATE_STAGE",
      stage: newStage,
    })
  })
})

describe("setInitialState", () => {
  it("creates an action to set the retro's initial state", () => {
    const initialState = { stage: "prime-directive", inserted_at: "2017-04-14T17:30:10" }

    expect(actionCreators.setInitialState(initialState)).to.deep.equal({
      type: "SET_INITIAL_STATE",
      initialState,
    })
  })
})
