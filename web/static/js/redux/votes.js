import uuidv4 from "uuid/v4"

export const types = {
  ADD_VOTE: "ADD_VOTE",
  RETRACT_VOTE: "RETRACT_VOTE",
  VOTE_SUBMISSION_ACCEPTED: "VOTE_SUBMISSION_ACCEPTED",
  VOTE_SUBMISSION_REJECTED: "VOTE_SUBMISSION_REJECTED",
  VOTE_RETRACTION_REJECTED: "VOTE_RETRACTION_REJECTED",
}

const addVote = vote => ({
  type: types.ADD_VOTE,
  vote,
})

const retractVote = vote => ({
  type: types.RETRACT_VOTE,
  vote,
})

const voteSubmissionFailure = optimisticUiVote => ({
  type: types.VOTE_SUBMISSION_REJECTED,
  optimisticUUID: optimisticUiVote.optimisticUUID,
  error: { message: "Vote submission failed. Please try again." },
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
        type: types.VOTE_SUBMISSION_ACCEPTED,
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
      dispatch({
        type: types.VOTE_RETRACTION_REJECTED,
        error: { message: "Vote retraction failed. Please try again." },
      })
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
    case types.ADD_VOTE:
      return [...state, action.vote]
    case types.VOTE_SUBMISSION_ACCEPTED:
      return state.map(vote => {
        return vote.optimisticUUID === action.optimisticUUID ? action.persistedVote : vote
      })
    case types.VOTE_SUBMISSION_REJECTED:
      return state.filter(vote => vote.optimisticUUID !== action.optimisticUUID)
    case types.RETRACT_VOTE:
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
