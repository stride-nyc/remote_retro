export const reducer = (state = null, action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.inserted_at
    default:
      return state
  }
}

export default reducer
