import NewFacilitator from "../components/new_facilitator"
import StageConfig from "../services/stage_config"
import actionTypes from "./action_types"

export const actions = {
  clearAlert: () => ({ type: actionTypes.CLEAR_ALERT }),
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case actionTypes.RETRO_STAGE_PROGRESSION_COMMITTED: {
      const { payload } = action
      const stageConfig = StageConfig.retrieveFor(payload.retro)
      return stageConfig.arrivalAlert
    }
    case actionTypes.SHOW_STAGE_HELP:
      return action.help
    case actionTypes.CURRENT_USER_HAS_BECOME_FACILITATOR: {
      return {
        headerText: "You've been granted the facilitatorship!",
        BodyComponent: NewFacilitator,
      }
    }
    case actionTypes.CLEAR_ALERT:
      return null
    default:
      return state
  }
}
