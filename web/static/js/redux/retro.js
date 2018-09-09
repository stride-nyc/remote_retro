import stageConfigs from "../configs/stage_configs"
import { types as errorTypes } from "./error"

export const types = {
  SET_INITIAL_STATE: "SET_INITIAL_STATE",
  UPDATE_RETRO: "UPDATE_RETRO",
}

export const actions = {
  updateRetroSync: retro => ({
    type: types.UPDATE_RETRO,
    retro,
    stageConfigs,
  }),

  updateRetroAsync: params => {
    return (dispatch, getState, retroChannel) => {
      const push = retroChannel.push("retro_edited", params)

      push.receive("error", () => {
        dispatch({
          type: errorTypes.SET_ERROR,
          error: { message: "Retro update failed. Please try again." },
        })
      })
    }
  },

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
    case types.UPDATE_RETRO:
      return { ...state, ...action.retro }
    default:
      return state
  }
}

export default reducer
