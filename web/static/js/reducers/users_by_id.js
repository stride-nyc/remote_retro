import keyBy from "lodash/keyBy"

export default (state = {}, action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return keyBy(action.initialState.users, "id")
    case "SET_USERS":
      return Object.assign(state, keyBy(action.users, "id"))
    case "SYNC_PRESENCE_DIFF": {
      const presencesRepresentingJoins = Object.values(action.presenceDiff.joins)
      const users = presencesRepresentingJoins.map(join => join.user)
      return Object.assign(state, keyBy(users, "id"))
    }
    default:
      return state
  }
}
