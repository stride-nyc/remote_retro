import stageConfigs from "../configs/stage_configs"

export const updateStage = newStage => ({
  type: "UPDATE_STAGE",
  stage: newStage,
  stageConfigs,
})

export const setInitialState = initialState => ({
  type: "SET_INITIAL_STATE",
  initialState,
})
