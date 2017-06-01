import update from "immutability-helper"

const user = (state = [], action) => {
  switch (action.type) {
  case "ADD_USERS":
    return action.users
  case "UPDATE_USER":
    const { userToken, newAttributes } = action
    const index = state.findIndex(user => user.token === userToken)
    return update(state, {
      [index]: { $set: { ...state[index], ...newAttributes } }
    })
  default:
    return state
  }
}

export default user
