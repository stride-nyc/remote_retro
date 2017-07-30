import stageProgressionConfigs from "../configs/stage_progression_configs"

export const updateStage = newStage => ({
  type: "UPDATE_STAGE",
  stage: newStage,
  stageProgressionConfigs,
})

export const setInitialState = initialState => ({
  type: "SET_INITIAL_STATE",
  initialState,
})
