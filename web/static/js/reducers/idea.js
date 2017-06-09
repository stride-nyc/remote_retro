const idea = (state = [], action) => {
  switch (action.type) {
    case "SET_IDEAS":
      return action.ideas
    case "ADD_IDEA":
      return [...state, action.idea]
    default:
      return state
  }
}

export default idea
