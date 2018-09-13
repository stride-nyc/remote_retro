import stageConfigs from "../configs/stage_configs"
import { types as errorTypes } from "./error"

export const types = {
  SET_INITIAL_STATE: "SET_INITIAL_STATE",
  RETRO_UPDATE_COMMITTED: "RETRO_UPDATE_COMMITTED",
  RETRO_UPDATE_REQUESTED: "RETRO_UPDATE_REQUESTED",
}

export const actions = {
  updateRetroSync: retro => ({
    type: types.RETRO_UPDATE_COMMITTED,
    retro,
    stageConfigs,
  }),

  updateRetroAsync: params => {
    return (dispatch, getState, retroChannel) => {
      const push = retroChannel.push("retro_edited", params)
      dispatch({ type: types.RETRO_UPDATE_REQUESTED })

      push.receive("error", () => {
        dispatch({
          type: errorTypes.SET_ERROR,
          referer: "RETRO_UPDATE",
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
    case types.RETRO_UPDATE_REQUESTED:
      return { ...state, updateRequested: true }
    case types.RETRO_UPDATE_COMMITTED:
      return { ...state, updateRequested: false, ...action.retro }
    case errorTypes.SET_ERROR:
      if (action.referer !== "RETRO_UPDATE") { return state }
      return { ...state, updateRequested: false }
    default:
      return state
  }
}

export default reducer
