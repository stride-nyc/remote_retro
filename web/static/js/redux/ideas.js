import { types as errorTypes } from "./error"

const types = {
  ADD_IDEA: "ADD_IDEA",
  UPDATE_IDEA: "UPDATE_IDEA",
  DELETE_IDEA: "DELETE_IDEA",
}

const updateIdea = (ideaId, newAttributes) => ({
  type: types.UPDATE_IDEA,
  ideaId,
  newAttributes,
})

export const actions = {
  updateIdea,
  addIdea: idea => ({
    type: types.ADD_IDEA,
    idea,
  }),

  submitIdeaDeletion: ideaId => {
    return (dispatch, getState, retroChannel) => {
      retroChannel.push("idea_deleted", ideaId)

      const updateIdeaAction = updateIdea(ideaId, { deletionSubmitted: true })
      dispatch(updateIdeaAction)
    }
  },

  submitIdea: idea => {
    return (dispatch, getState, retroChannel) => {
      const push = retroChannel.push("idea_submitted", idea)

      push.receive("error", () => {
        dispatch({
          type: errorTypes.SET_ERROR,
          error: { message: "Idea submission failed. Please try again." },
        })
      })
    }
  },

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
