const types = {
  CLEAR_ALERT: "CLEAR_ALERT",
}

export const actions = {
  clearAlert: () => ({ type: types.CLEAR_ALERT }),
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case "UPDATE_STAGE": {
      const { stage, stageConfigs } = action
      return stageConfigs[stage].alert
    }
    case types.CLEAR_ALERT:
      return null
    default:
      return state
  }
}
