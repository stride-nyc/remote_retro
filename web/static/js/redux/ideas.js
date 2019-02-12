export const types = {
  IDEA_SUBMISSION_COMMITTED: "IDEA_SUBMISSION_COMMITTED",
  IDEA_SUBMISSION_REJECTED: "IDEA_SUBMISSION_REJECTED",
  IDEA_UPDATE_COMMITTED: "IDEA_UPDATE_COMMITTED",
  IDEA_UPDATE_REJECTED: "IDEA_UPDATE_REJECTED",
  IDEA_DELETION_COMMITTED: "IDEA_DELETION_COMMITTED",
  IDEA_DELETION_REJECTED: "IDEA_DELETION_REJECTED",
}

const updateIdea = (ideaId, newAttributes) => ({
  type: types.IDEA_UPDATE_COMMITTED,
  ideaId,
  newAttributes,
})

const ideaDeletionRejected = ideaId => ({
  type: types.IDEA_DELETION_REJECTED,
  ideaId,
})

export const actions = {
  updateIdea,
  addIdea: idea => ({
    type: types.IDEA_SUBMISSION_COMMITTED,
    idea,
  }),

  submitIdeaEditAsync: ideaParams => {
    return (dispatch, getState, retroChannel) => {
      const push = retroChannel.push("idea_edited", ideaParams)

      const updateIdeaAction = updateIdea(ideaParams.id, { editSubmitted: true })
      dispatch(updateIdeaAction)

      push.receive("error", () => {
        dispatch({ type: types.IDEA_UPDATE_REJECTED, ideaId: ideaParams.id })
      })
    }
  },

  submitIdeaDeletionAsync: ideaId => {
    return (dispatch, getState, retroChannel) => {
      const push = retroChannel.push("idea_deleted", ideaId)

      const updateIdeaAction = updateIdea(ideaId, { deletionSubmitted: true })
      dispatch(updateIdeaAction)

      push.receive("error", () => {
        const ideaDeletionRejectedAction = ideaDeletionRejected(ideaId)
        dispatch(ideaDeletionRejectedAction)
      })
    }
  },

  initiateIdeaEditState: ideaId => {
    return (dispatch, getState, retroChannel) => {
      retroChannel.push("idea_edit_state_enabled", { id: ideaId })

      const updateIdeaAction = updateIdea(ideaId, { inEditState: true, isLocalEdit: true })
      dispatch(updateIdeaAction)
    }
  },

  cancelIdeaEditState: ideaId => {
    return (dispatch, getState, retroChannel) => {
      retroChannel.push("idea_edit_state_disabled", { id: ideaId })

      const updateAttributes = { inEditState: false, liveEditText: null, isLocalEdit: null }
      const updateIdeaAction = updateIdea(ideaId, updateAttributes)
      dispatch(updateIdeaAction)
    }
  },

  submitIdea: idea => {
    return (dispatch, getState, retroChannel) => {
      const push = retroChannel.push("idea_submitted", idea)

      push.receive("error", () => {
        dispatch({ type: types.IDEA_SUBMISSION_REJECTED })
      })
    }
  },

  deleteIdea: ideaId => ({
    type: types.IDEA_DELETION_COMMITTED,
    ideaId,
  }),
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.ideas
    case types.IDEA_SUBMISSION_COMMITTED:
      return [...state, action.idea]
    case types.IDEA_UPDATE_COMMITTED:
      return state.map(idea => (
        (idea.id === action.ideaId) ? { ...idea, ...action.newAttributes } : idea
      ))
    case types.IDEA_UPDATE_REJECTED:
      return state.map(idea => {
        return idea.id === action.ideaId ? { ...idea, editSubmitted: false } : idea
      })
    case types.IDEA_DELETION_COMMITTED:
      return state.filter(idea => idea.id !== action.ideaId)
    case types.IDEA_DELETION_REJECTED:
      return state.map(idea => {
        return idea.id === action.ideaId ? { ...idea, deletionSubmitted: false } : idea
      })
    default:
      return state
  }
}
