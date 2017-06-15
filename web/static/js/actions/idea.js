export const addIdea = idea => ({
  type: "ADD_IDEA",
  idea,
})

export const setIdeas = ideas => ({
  type: "SET_IDEAS",
  ideas,
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


