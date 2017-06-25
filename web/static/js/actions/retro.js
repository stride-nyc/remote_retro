export const updateStage = newStage => ({
  type: "UPDATE_STAGE",
  stage: newStage,
})

export const setInitialState = initialState => ({
  type: "SET_INITIAL_STATE",
  initialState,
})
