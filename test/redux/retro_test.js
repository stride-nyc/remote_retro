import { actions as actionCreators } from "../../web/static/js/redux/retro"

import stageConfigs from "../../web/static/js/configs/stage_configs"
import STAGES from "../../web/static/js/configs/stages"

const { PRIME_DIRECTIVE } = STAGES

describe("updateStage", () => {
  it("creates an action to update the retro's stage", () => {
    const newStage = "newSlang"

    expect(actionCreators.updateStage(newStage)).to.deep.equal({
      type: "UPDATE_STAGE",
      stage: newStage,
      stageConfigs,
    })
  })
})

describe("setInitialState", () => {
  it("creates an action to set the retro's initial state", () => {
    const initialState = { stage: PRIME_DIRECTIVE, inserted_at: "2017-04-14T17:30:10" }

    expect(actionCreators.setInitialState(initialState)).to.deep.equal({
      type: "SET_INITIAL_STATE",
      initialState,
    })
  })
})
