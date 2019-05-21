import { types as retroTypes } from "./retro"
import NewFacilitator from "../components/new_facilitator"

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
    case retroTypes.RETRO_UPDATE_COMMITTED: {
      const { retroChanges, stageConfigs } = action
      return retroChanges.stage ? stageConfigs[retroChanges.stage].alert : null
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
