export const setPresences = presences => ({
  type: "SET_PRESENCES",
  presences,
})

export const updatePresence = (presenceToken, newAttributes) => ({
  type: "UPDATE_PRESENCE",
  presenceToken,
  newAttributes,
})

export const syncPresenceDiff = presenceDiff => ({
  type: "SYNC_PRESENCE_DIFF",
  presenceDiff,
})
