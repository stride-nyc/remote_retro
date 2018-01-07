import keyBy from "lodash/keyBy"

export default (state = {}, { type, initialState }) => {
  switch (type) {
    case "SET_INITIAL_STATE":
      return keyBy(initialState.users, "id");
    default:
      return state
  }
}
