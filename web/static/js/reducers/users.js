import minBy from "lodash/minBy"
import values from "lodash/values"
import reject from "lodash/reject"

const assignFacilitatorToLongestTenured = users => {
  const facilitator = minBy(users, "online_at")
  return users.map(user => ({ ...user, is_facilitator: facilitator.token === user.token }))
}

const addArrivals = (existingUsers, arrivals) => {
  const usersInArrivals = values(arrivals).map(join => join.user)
  const newUsers = usersInArrivals.filter(user => !existingUsers.find(u => user.token === u.token))

  return [...existingUsers, ...newUsers]
}

const removeDepartures = (users, departures) => {
  const departureTokens = Object.keys(departures)
  return reject(users, user => departureTokens.includes(user.token))
}

const users = (state = [], action) => {
  switch (action.type) {
    case "SET_USERS":
      return assignFacilitatorToLongestTenured(action.users)
    case "SYNC_PRESENCE_DIFF": {
      const { presenceDiff: { joins, leaves } } = action
      const withArrivalsAdded = addArrivals(state, joins)
      const withDeparturesRemoved = removeDepartures(withArrivalsAdded, leaves)
      return assignFacilitatorToLongestTenured(withDeparturesRemoved)
    }
    case "UPDATE_PRESENCE": {
      const { userToken, newAttributes } = action
      return state.map(user => (user.token === userToken ? { ...user, ...newAttributes } : user))
    }
    default:
      return state
  }
}

export default users

// SELECTORS
export const getUser = (state, userId) => (
  state.users ? state.users.find(user => user.id === userId) : null
)
