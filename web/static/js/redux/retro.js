import stageConfigs from "../configs/stage_configs"

export const types = {
  SET_INITIAL_STATE: "SET_INITIAL_STATE",
}

export const actions = {
  updateStage: newStage => ({
    type: "UPDATE_STAGE",
    stage: newStage,
    stageConfigs,
  }),

  setInitialState: initialState => ({
    type: types.SET_INITIAL_STATE,
    initialState,
  }),
}

const _stripAttributesPointingToArrays = initialState => {
  const strippedOfArrayAttributes = {}
  Object.keys(initialState).forEach(key => {
    const value = initialState[key]
    if (value.constructor !== Array) {
      strippedOfArrayAttributes[key] = value
    }
  })

  return strippedOfArrayAttributes
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case types.SET_INITIAL_STATE:
      // initial state comes with retro associations preloaded, but other
      // reducers parse those out and manager those slices of state
      return _stripAttributesPointingToArrays(action.initialState)
    default:
      return state
  }
}

export default reducer
