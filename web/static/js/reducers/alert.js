const alert = (state = null, action) => {
  switch (action.type) {
    case "UPDATE_STAGE": {
      const { stage, stageConfigs } = action
      return stageConfigs[stage].alert
    }
    case "CLEAR_ALERT":
      return null
    default:
      return state
  }
}

export default alert
