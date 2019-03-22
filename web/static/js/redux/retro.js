import stageConfigs from "../configs/stage_configs"
import { types as alertTypes } from "./alert"

export const types = {
  SET_INITIAL_STATE: "SET_INITIAL_STATE",
  RETRO_UPDATE_COMMITTED: "RETRO_UPDATE_COMMITTED",
  RETRO_UPDATE_REQUESTED: "RETRO_UPDATE_REQUESTED",
  RETRO_UPDATE_REJECTED: "RETRO_UPDATE_REJECTED",
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
          type: types.RETRO_UPDATE_REJECTED,
        })
      })
    }
  },

  setInitialState: initialState => ({
    type: types.SET_INITIAL_STATE,
    initialState,
  }),

  showStageHelp: retro => ({
    type: alertTypes.SHOW_STAGE_HELP,
    retro,
    stageConfigs,
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
    case types.RETRO_UPDATE_REJECTED:
      return { ...state, updateRequested: false }
    default:
      return state
  }
}

export default reducer
