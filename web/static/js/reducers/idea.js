const idea = (state = [], action) => {
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
    default:
      return state
  }
}

export default idea

export const getIdeasWithAuthors = (ideas, users) => {
  console.log('here are the ideas', ideas)
  return ideas.map(idea => {
    const ideaWithAuthor = idea
    console.log("what is the id", idea.user_id, users[0].id)
    ideaWithAuthor.author = users.find(user => user.id === idea.user_id)
    console.log("author", ideaWithAuthor.author)
    console.log("here da users", users)
    delete ideaWithAuthor.user_id
    return ideaWithAuthor
  })
}
