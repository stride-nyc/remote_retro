import keyBy from "lodash/keyBy"
import values from "lodash/values"

import actionTypes from "./action_types"

const USER_PRIMARY_KEY = "id"

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.SET_INITIAL_STATE:
      return keyBy(action.initialState.users, USER_PRIMARY_KEY)
    case actionTypes.SET_PRESENCES:
      return { ...state, ...keyBy(action.presences, USER_PRIMARY_KEY) }
    case actionTypes.SYNC_PRESENCE_DIFF: {
      const presencesRepresentingJoins = values(action.presenceDiff.joins)
      const users = presencesRepresentingJoins.map(join => join.user)
      return { ...state, ...keyBy(users, USER_PRIMARY_KEY) }
    }
    case actionTypes.USER_UPDATE_COMMITTED: {
      const { id } = action.updatedUser
      const updatedUser = {
        ...state[id],
        ...action.updatedUser,
      }

      return {
        ...state,
        [id]: updatedUser,
      }
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

export const actions = {
  updateUserAsync: (id, params) => {
    return (dispatch, state, retroChannel) => {
      const push = retroChannel.push("user_edited", { id, ...params })

      push.receive("ok", updatedUser => {
        dispatch({
          type: actionTypes.USER_UPDATE_COMMITTED,
          updatedUser,
        })
      })

      push.receive("error", () => {
        dispatch({ type: actionTypes.USER_UPDATE_REJECTED })
      })
    }
  },
}
