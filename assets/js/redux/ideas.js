const types = {
  ADD_IDEA: "ADD_IDEA",
  UPDATE_IDEA: "UPDATE_IDEA",
  DELETE_IDEA: "DELETE_IDEA",
}

export const actions = {
  addIdea: idea => ({
    type: types.ADD_IDEA,
    idea,
  }),

  updateIdea: (ideaId, newAttributes) => ({
    type: types.UPDATE_IDEA,
    ideaId,
    newAttributes,
  }),

  deleteIdea: ideaId => ({
    type: types.DELETE_IDEA,
    ideaId,
  }),
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.ideas
    case types.ADD_IDEA:
      return [...state, action.idea]
    case types.UPDATE_IDEA:
      return state.map(idea => (
        (idea.id === action.ideaId) ? { ...idea, ...action.newAttributes } : idea
      ))
    case types.DELETE_IDEA:
      return state.filter(idea => idea.id !== action.ideaId)
    default:
      return state
  }
}
