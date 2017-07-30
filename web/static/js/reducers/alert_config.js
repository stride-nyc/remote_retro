const alertConfig = (state = null, action) => {
  switch (action.type) {
    case "UPDATE_STAGE": {
      const { stage, stageConfigs } = action
      return stageConfigs[stage].alertConfig
    }
    case "CLEAR_ALERT":
      return null
    default:
      return state
  }
}

export default alertConfig
