export const setUsers = users => ({
  type: "SET_USERS",
  users,
})

export const updateUser = (userToken, newAttributes) => ({
  type: "UPDATE_USER",
  userToken,
  newAttributes,
})
