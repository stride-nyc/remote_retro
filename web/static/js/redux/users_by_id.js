import keyBy from "lodash/keyBy"
import values from "lodash/values"

const USER_PRIMARY_KEY = "id"

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return keyBy(action.initialState.users, USER_PRIMARY_KEY)
    case "SET_PRESENCES":
      return { ...state, ...keyBy(action.users, USER_PRIMARY_KEY) }
    case "SYNC_PRESENCE_DIFF": {
      const presencesRepresentingJoins = values(action.presenceDiff.joins)
      const users = presencesRepresentingJoins.map(join => join.user)
      return { ...state, ...keyBy(users, USER_PRIMARY_KEY) }
    }
    default:
      return state
  }
}

export const selectors = {
  getUserById: (state, userId) => {
    return state.usersById[userId]
  },
  getUserPresences: ({ presences, usersById, facilitatorId }) => {
    return presences.map(presence => {
      const { user_id, ...restOfPresenceAttrs } = presence
      const user = usersById[user_id]
      return {
        ...user,
        ...restOfPresenceAttrs,
        is_facilitator: user.id === facilitatorId,
      }
    })
  },
  getCurrentUserPresence: state => {
    const userPresences = selectors.getUserPresences(state)
    return userPresences.find(presence => presence.token === window.userToken)
  },
}
