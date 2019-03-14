import keyBy from "lodash/keyBy"
import values from "lodash/values"

const USER_PRIMARY_KEY = "id"

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return keyBy(action.initialState.users, USER_PRIMARY_KEY)
    case "SET_PRESENCES":
      return { ...state, ...keyBy(action.presences, USER_PRIMARY_KEY) }
    case "SYNC_PRESENCE_DIFF": {
      const presencesRepresentingJoins = values(action.presenceDiff.joins)
      const users = presencesRepresentingJoins.map(join => join.user)
      return { ...state, ...keyBy(users, USER_PRIMARY_KEY) }
    }
    default:
      return state
  }
}

let previouslyDerivedCurrentUserPresence
export const selectors = {
  getUserById: (state, userId) => {
    return state.usersById[userId]
  },
  getUserPresences: ({ presences, usersById, retro }) => {
    return presences.map(presence => {
      // eslint-disable-next-line camelcase
      const { user_id, ...restOfPresenceAttrs } = presence
      const user = usersById[user_id]
      return {
        ...user,
        ...restOfPresenceAttrs,
        is_facilitator: user.id === retro.facilitator_id,
      }
    })
  },
  getCurrentUserPresence: state => {
    const userPresences = selectors.getUserPresences(state)
    const currentUserPresence = userPresences.find(presence => presence.token === window.userToken)

    // account for cases where channel has crashed and there are momentarily
    // no presences, as events can still be pushed, and these events need ids/tokens
    if (currentUserPresence) {
      previouslyDerivedCurrentUserPresence = currentUserPresence
    }

    return previouslyDerivedCurrentUserPresence
  },
}
