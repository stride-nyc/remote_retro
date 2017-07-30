const alertConfig = (state = null, action) => {
  switch (action.type) {
    case "UPDATE_STAGE": {
      const { stage, stageProgressionConfigs } = action
      return stageProgressionConfigs[stage].alertConfig
    }
    case "CLEAR_ALERT":
      return null
    default:
      return state
  }
}

export default alertConfig
