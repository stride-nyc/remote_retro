import keyBy from "lodash/keyBy"

export default (state = {}, { type, initialState, presenceDiff }) => {
  switch (type) {
    case "SET_INITIAL_STATE":
      return keyBy(initialState.users, "id");
    case "SYNC_PRESENCE_DIFF":
      const presencesRepresentingJoins = Object.values(presenceDiff.joins)
      const users = presencesRepresentingJoins.map(join => join.user)
      return Object.assign(state, keyBy(users, "id"))
    default:
      return state
  }
}
