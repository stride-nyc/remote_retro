import { types as alertTypes } from "./alert"

export const types = {
  SET_INITIAL_STATE: "SET_INITIAL_STATE",
  RETRO_UPDATE_REQUESTED: "RETRO_UPDATE_REQUESTED",
  RETRO_UPDATE_REJECTED: "RETRO_UPDATE_REJECTED",
  RETRO_STAGE_PROGRESSION_COMMITTED: "RETRO_STAGE_PROGRESSION_COMMITTED",
  RETRO_FACILITATOR_CHANGE_COMMITTED: "RETRO_FACILITATOR_CHANGE_COMMITTED",
}

export const actions = {
  retroUpdateCommitted: payload => {
    const { retro: updatedRetro } = payload

    return (dispatch, getState) => {
      const { retro: { stage } } = getState()

      let type
      if (updatedRetro.stage !== stage) {
        type = types.RETRO_STAGE_PROGRESSION_COMMITTED
      } else {
        type = types.RETRO_FACILITATOR_CHANGE_COMMITTED
      }

      dispatch({ type, payload })
    }
  },

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

  currentUserHasBecomeFacilitator: () => ({
    type: alertTypes.CURRENT_USER_HAS_BECOME_FACILITATOR,
  }),

  showStageHelp: help => ({
    type: alertTypes.SHOW_STAGE_HELP,
    help,
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
    case types.RETRO_FACILITATOR_CHANGE_COMMITTED:
    case types.RETRO_STAGE_PROGRESSION_COMMITTED:
      return { ...state, updateRequested: false, ...action.payload.retro }
    case types.RETRO_UPDATE_REJECTED:
      return { ...state, updateRequested: false }
    default:
      return state
  }
}

export default reducer
