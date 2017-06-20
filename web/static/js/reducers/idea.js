const idea = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.ideas
    case "SET_IDEAS":
      return action.ideas
    case "ADD_IDEA":
      return [...state, action.idea]
    case "UPDATE_IDEA":
      return state.map(idea => (
        (idea.id === action.ideaId) ? { ...idea, ...action.newAttributes } : idea
      ))
    case "DELETE_IDEA":
      return state.filter(idea => idea.id !== action.ideaId)
    default:
      return state
  }
}

export default idea
