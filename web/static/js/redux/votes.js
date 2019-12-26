import uuidv4 from "uuid/v4"

import actionTypes from "./action_types"

const addVote = vote => ({
  type: actionTypes.ADD_VOTE,
  vote,
})

const retractVote = vote => ({
  type: actionTypes.RETRACT_VOTE,
  vote,
})

const voteSubmissionFailure = optimisticUiVote => ({
  type: actionTypes.VOTE_SUBMISSION_REJECTED,
  optimisticUUID: optimisticUiVote.optimisticUUID,
})

const buildOptimisticUiVote = snakeCaseVoteAttributes => {
  const optimisticUUID = uuidv4()

  return {
    optimisticUUID,
    ...snakeCaseVoteAttributes,
  }
}

const submitVote = (idea, user) => {
  return (dispatch, getState, retroChannel) => {
    const snakeCaseVoteAttributes = { idea_id: idea.id, user_id: user.id }
    const push = retroChannel.push("vote_submitted", snakeCaseVoteAttributes)

    const optimisticUiVote = buildOptimisticUiVote(snakeCaseVoteAttributes)
    const addOptimisticUiVoteAction = addVote(optimisticUiVote)
    dispatch(addOptimisticUiVoteAction)

    push.receive("ok", vote => {
      dispatch({
        type: actionTypes.VOTE_SUBMISSION_ACCEPTED,
        optimisticUUID: optimisticUiVote.optimisticUUID,
        persistedVote: vote,
      })
    })

    push.receive("error", () => {
      const failureAction = voteSubmissionFailure(optimisticUiVote)
      dispatch(failureAction)
    })
  }
}

const submitVoteRetraction = vote => {
  return (dispatch, getState, retroChannel) => {
    const push = retroChannel.push("vote_retracted", vote)

    push.receive("error", () => {
      dispatch({ type: actionTypes.VOTE_RETRACTION_REJECTED })
    })
  }
}

export const actions = {
  addVote,
  retractVote,
  submitVote,
  submitVoteRetraction,
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.votes
    case actionTypes.ADD_VOTE:
      return [...state, action.vote]
    case actionTypes.VOTE_SUBMISSION_ACCEPTED:
      return state.map(vote => {
        return vote.optimisticUUID === action.optimisticUUID ? action.persistedVote : vote
      })
    case actionTypes.VOTE_SUBMISSION_REJECTED:
      return state.filter(vote => vote.optimisticUUID !== action.optimisticUUID)
    case actionTypes.RETRACT_VOTE:
      return state.filter(vote => vote.id !== action.vote.id)
    default:
      return state
  }
}

export const selectors = {
  cumulativeVoteCountForUser: ({ votes }, user) => {
    const votesForUser = votes.filter(vote => vote.user_id === user.id)
    return votesForUser.length
  },

  votesForIdea: ({ votes }, idea) => {
    return votes.filter(vote => vote.idea_id === idea.id)
  },
}

export default reducer
