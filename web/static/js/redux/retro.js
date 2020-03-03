import { selectors as userSelectors } from "./users_by_id"

import actionTypes from "./action_types"
import STAGES from "../configs/stages"

const { ACTION_ITEMS, GROUPS_ACTION_ITEMS } = STAGES

const currentUserHasBecomeFacilitator = () => ({
  type: actionTypes.CURRENT_USER_HAS_BECOME_FACILITATOR,
})

export const actions = {
  retroUpdateCommitted: payload => {
    const { retro: updatedRetro } = payload

    return (dispatch, getState) => {
      const state = getState()
      const currentUser = userSelectors.getCurrentUserPresence(state)

      const { retro: { stage } } = state

      const stageProgressionsCommitted = updatedRetro.stage !== stage

      const type = stageProgressionsCommitted
        ? actionTypes.RETRO_STAGE_PROGRESSION_COMMITTED
        : actionTypes.RETRO_FACILITATOR_CHANGE_COMMITTED

      dispatch({ type, payload })

      const currentUserIsNewFacilitator = type === actionTypes.RETRO_FACILITATOR_CHANGE_COMMITTED
        && currentUser.id === updatedRetro.facilitator_id

      if (currentUserIsNewFacilitator) {
        dispatch(currentUserHasBecomeFacilitator())
      }
    }
  },

  updateRetroAsync: params => {
    return (dispatch, getState, retroChannel) => {
      const push = retroChannel.push("retro_edited", params)
      dispatch({ type: actionTypes.RETRO_UPDATE_REQUESTED })

      push.receive("error", () => {
        dispatch({
          type: actionTypes.RETRO_UPDATE_REJECTED,
        })
      })
    }
  },

  setInitialState: initialState => ({
    type: actionTypes.SET_INITIAL_STATE,
    initialState,
  }),

  currentUserHasBecomeFacilitator,

  showStageHelp: help => ({
    type: actionTypes.SHOW_STAGE_HELP,
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
    case actionTypes.SET_INITIAL_STATE:
      // initial state comes with retro associations preloaded, but other
      // reducers parse those out and manager those slices of state
      return _stripAttributesPointingToArrays(action.initialState)
    case actionTypes.RETRO_UPDATE_REQUESTED:
      return { ...state, updateRequested: true }
    case actionTypes.RETRO_FACILITATOR_CHANGE_COMMITTED:
    case actionTypes.RETRO_STAGE_PROGRESSION_COMMITTED:
      return { ...state, updateRequested: false, ...action.payload.retro }
    case actionTypes.RETRO_UPDATE_REJECTED:
      return { ...state, updateRequested: false }
    default:
      return state
  }
}

export const selectors = {
  isAnActionItemsStage: ({ retro }) => {
    return [ACTION_ITEMS, GROUPS_ACTION_ITEMS].includes(retro.stage)
  },
}

export default reducer
