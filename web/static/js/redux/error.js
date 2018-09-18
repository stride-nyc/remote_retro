import { types as votingTypes } from "./votes"
import { types as retroTypes } from "./retro"
import { types as ideaTypes } from "./ideas"

export const types = {
  CLEAR_ERROR: "CLEAR_ERROR",
  ...ideaTypes,
  ...retroTypes,
  ...votingTypes,
}

export const actions = {
  clearError: () => ({ type: types.CLEAR_ERROR }),
}

export const reducer = (state = null, action) => {
  switch (action.type) {
    case types.IDEA_SUBMISSION_REJECTED:
      return { message: "Idea submission failed. Please try again." }
    case types.IDEA_UPDATE_REJECTED:
      return { message: "Idea update failed. Please try again." }
    case types.IDEA_DELETION_REJECTED:
      return { message: "Idea deletion failed. Please try again." }
    case types.RETRO_UPDATE_REJECTED:
      return { message: "Retro update failed. Please try again." }
    case types.VOTE_SUBMISSION_REJECTED:
      return { message: "Vote submission failed. Please try again." }
    case types.CLEAR_ERROR:
      return null
    default:
      return state
  }
}
