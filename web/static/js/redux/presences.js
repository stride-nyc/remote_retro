import values from "lodash/values"
import reject from "lodash/reject"
import includes from "lodash/includes"

export const actions = {
  setPresences: presences => ({
    type: "SET_PRESENCES",
    presences,
  }),

  updatePresence: (presenceToken, newAttributes) => ({
    type: "UPDATE_PRESENCE",
    presenceToken,
    newAttributes,
  }),

  syncPresenceDiff: presenceDiff => ({
    type: "SYNC_PRESENCE_DIFF",
    presenceDiff,
  }),
}

const addArrivals = (existingUsers, arrivals) => {
  const presencesInArrivals = values(arrivals).map(join => join.user)
  const newUsers = presencesInArrivals.filter(presence =>
    !existingUsers.find(u => presence.token === u.token)
  )

  return [...existingUsers, ...newUsers]
}

const removeDepartures = (presences, departures) => {
  const departureTokens = Object.keys(departures)
  return reject(presences, presence => includes(departureTokens, presence.token))
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PRESENCES":
      return action.presences
    case "SYNC_PRESENCE_DIFF": {
      const { presenceDiff: { joins, leaves } } = action
      const withArrivalsAdded = addArrivals(state, joins)
      return removeDepartures(withArrivalsAdded, leaves)
    }
    case "UPDATE_PRESENCE": {
      const { presenceToken, newAttributes } = action
      return state.map(presence => (
        presence.token === presenceToken ? { ...presence, ...newAttributes } : presence)
      )
    }
    default:
      return state
  }
}

export const selectors = {
  findCurrentUser: state => {
    const currentUserPresence = state.presences.find(user => user.token === window.userToken)
    if (!currentUserPresence) { return {} }

    return {
      ...currentUserPresence,
      is_facilitator: state.facilitatorId === currentUserPresence.id,
    }
  },
}

export default reducer
