export default (state = [], action) => {
  switch (action.type) {
    case "ADD_VOTE":
      return [...state, action.vote]
    default:
      return state
  }
}
