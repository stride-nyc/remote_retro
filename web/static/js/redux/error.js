import actionTypes from "./action_types"

export const actions = {
  clearError: () => ({ type: actionTypes.CLEAR_ERROR }),
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case actionTypes.IDEA_SUBMISSION_REJECTED:
      return { message: "Idea submission failed. Please try again." }
    case actionTypes.IDEA_UPDATE_REJECTED:
      return { message: "Idea update failed. Please try again." }
    case actionTypes.IDEA_DELETION_REJECTED:
      return { message: "Idea deletion failed. Please try again." }
    case actionTypes.RETRO_UPDATE_REJECTED:
      return { message: "Retro update failed. Please try again." }
    case actionTypes.VOTE_SUBMISSION_REJECTED:
      return { message: "Vote submission failed. Please try again." }
    case actionTypes.VOTE_RETRACTION_REJECTED:
      return { message: "Vote retraction failed. Please try again." }
    case actionTypes.CLEAR_ERROR:
      return null
    default:
      return state
  }
}
