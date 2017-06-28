export const setUsers = users => ({
  type: "SET_USERS",
  users,
})

export const updateUser = (userToken, newAttributes) => ({
  type: "UPDATE_USER",
  userToken,
  newAttributes,
})

export const syncPresenceDiff = presenceDiff => ({
  type: "SYNC_PRESENCE_DIFF",
  presenceDiff,
})
