export const addUsers = users => ({
  type: "ADD_USERS",
  users,
})

export const updateUser = (userToken, newAttributes) => ({
  type: "UPDATE_USER",
  userToken,
  newAttributes,
})
