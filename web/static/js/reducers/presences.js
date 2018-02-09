import minBy from "lodash/minBy"
import values from "lodash/values"
import reject from "lodash/reject"

const assignFacilitatorToLongestTenured = presences => {
  const facilitator = minBy(presences, "online_at")
  return presences.map(presence => ({
    ...presence, is_facilitator: facilitator.token === presence.token,
  }))
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
  return reject(presences, presence => departureTokens.includes(presence.token))
}

const presences = (state = [], action) => {
  switch (action.type) {
    case "SET_PRESENCES":
      return assignFacilitatorToLongestTenured(action.presences)
    case "SYNC_PRESENCE_DIFF": {
      const { presenceDiff: { joins, leaves } } = action
      const withArrivalsAdded = addArrivals(state, joins)
      const withDeparturesRemoved = removeDepartures(withArrivalsAdded, leaves)
      return assignFacilitatorToLongestTenured(withDeparturesRemoved)
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

export default presences

export const findCurrentUser = state => {
  return state.find(user => user.token === window.userToken)
}

export const findFacilitator = state => {
  return state.find(user => user.is_facilitator)
}

export const findFacilitatorName = state => {
  const facilitator = findFacilitator(state)
  return facilitator ? facilitator.name : ""
}
