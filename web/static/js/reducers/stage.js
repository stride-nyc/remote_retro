const stage = (state = "prime-directive", action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.stage
    case "UPDATE_STAGE":
      return action.stage
    default:
      return state
  }
}

export default stage
