const types = {
  CLEAR_ALERT: "CLEAR_ALERT",
  RETRO_UPDATE_COMMITTED: "RETRO_UPDATE_COMMITTED",
  SHOW_STAGE_HELP: "SHOW_STAGE_HELP",
}

export const actions = {
  clearAlert: () => ({ type: types.CLEAR_ALERT }),
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case types.RETRO_UPDATE_COMMITTED: {
      const { retro, stageConfigs } = action
      return stageConfigs[retro.stage].alert
    }
    case types.SHOW_STAGE_HELP: {
      const { retro, stageConfigs } = action
      return stageConfigs[retro.stage].help
    }
    case types.CLEAR_ALERT:
      return null
    default:
      return state
  }
}
