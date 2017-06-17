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

