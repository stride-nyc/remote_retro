import { types as retroTypes } from "./retro"
import NewFacilitator from "../components/new_facilitator"

export const types = {
  CLEAR_ALERT: "CLEAR_ALERT",
  SHOW_STAGE_HELP: "SHOW_STAGE_HELP",
  NEW_FACILITATOR: "NEW_FACILITATOR",
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
    case types.SHOW_STAGE_HELP: {
      const { retro, stageConfigs } = action
      return stageConfigs[retro.stage].help || null
    }
    case types.NEW_FACILITATOR: {
      const configs = {
        headerText: "New Facilitator",
        BodyComponent: NewFacilitator,
      }
      return configs
    }
    case types.CLEAR_ALERT:
      return null
    default:
      return state
  }
}
