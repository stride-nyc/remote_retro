export const addIdea = idea => ({
  type: "ADD_IDEA",
  idea,
})

export const updateIdea = (ideaId, newAttributes) => ({
  type: "UPDATE_IDEA",
  ideaId,
  newAttributes,
})

export const deleteIdea = ideaId => ({
  type: "DELETE_IDEA",
  ideaId,
})
