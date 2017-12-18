const ideas = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.ideas
    case "ADD_IDEA":
      return [...state, action.idea]
    case "UPDATE_IDEA":
      return state.map(idea => (
        (idea.id === action.ideaId) ? { ...idea, ...action.newAttributes } : idea
      ))
    case "DELETE_IDEA":
      return state.filter(idea => idea.id !== action.ideaId)
    case "ADD_ACTION_ITEM":
      return [...state, action.actionItem]
    default:
      return state
  }
}

export default ideas
