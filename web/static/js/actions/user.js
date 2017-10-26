export const setUsers = users => ({
  type: "SET_USERS",
  users,
})

export const updatePresence = (userToken, newAttributes) => ({
  type: "UPDATE_PRESENCE",
  userToken,
  newAttributes,
})

export const syncPresenceDiff = presenceDiff => ({
  type: "SYNC_PRESENCE_DIFF",
  presenceDiff,
})
