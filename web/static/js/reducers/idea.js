const idea = (state = [], action) => {
  switch (action.type) {
    case "SET_IDEAS":
      return action.ideas
    case "ADD_IDEA":
      return [...state, action.idea]
    case "UPDATE_IDEA" :
      return state.map(idea => {
        if (idea.id == action.ideaId) {
          return Object.assign({}, idea, action.newAttributes)
        } else {
          return idea
        }
      })
    default:
      return state
  }
}

export default idea
