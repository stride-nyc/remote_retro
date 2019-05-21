import { types as retroTypes } from "./retro"
import NewFacilitator from "../components/new_facilitator"
import StageConfig from "../services/stage_config"

export const types = {
  CLEAR_ALERT: "CLEAR_ALERT",
  SHOW_STAGE_HELP: "SHOW_STAGE_HELP",
  CURRENT_USER_HAS_BECOME_FACILITATOR: "CURRENT_USER_HAS_BECOME_FACILITATOR",
}

export const actions = {
  clearAlert: () => ({ type: types.CLEAR_ALERT }),
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case retroTypes.RETRO_STAGE_PROGRESSION_COMMITTED: {
      const { retroChanges } = action
      const stageConfig = StageConfig.retrieveFor(retroChanges.stage)
      return stageConfig.alert
    }
    case types.SHOW_STAGE_HELP:
      return action.help
    case types.CURRENT_USER_HAS_BECOME_FACILITATOR: {
      return {
        headerText: "You've been granted the facilitatorship!",
        BodyComponent: NewFacilitator,
      }
    }
    case types.CLEAR_ALERT:
      return null
    default:
      return state
  }
}
