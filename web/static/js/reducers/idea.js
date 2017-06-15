const idea = (state = [], action) => {
  switch (action.type) {
    case "SET_IDEAS":
      return action.ideas
    case "ADD_IDEA":
      return [...state, action.idea]
    case "UPDATE_IDEA" :
      return state.map(idea => {
        return (idea.id === action.ideaId) ? Object.assign({}, idea, action.newAttributes) : idea
      })
    case "DELETE_IDEA" :
      return state.filter(idea => {
        return idea.id !== action.ideaId
      })
    default:
      return state
  }
}

export default idea
