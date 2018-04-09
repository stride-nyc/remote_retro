import stageConfigs from "../configs/stage_configs"

// eslint-disable-next-line import/prefer-default-export
export const actions = {
  updateStage: newStage => ({
    type: "UPDATE_STAGE",
    stage: newStage,
    stageConfigs,
  }),

  setInitialState: initialState => ({
    type: "SET_INITIAL_STATE",
    initialState,
  }),
}
