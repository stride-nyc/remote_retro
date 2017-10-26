export default (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.votes
    case "ADD_VOTE":
      return [...state, action.vote]
    default:
      return state
  }
}
