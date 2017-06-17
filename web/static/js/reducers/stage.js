const stage = (state = "idea-generation", action) => {
  switch (action.type) {
    case "UPDATE_STAGE":
      return action.stage
    default:
      return state
  }
}

export default stage
