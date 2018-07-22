import uuidv4 from "uuid/v4"

export const types = {
  ADD_VOTE: "ADD_VOTE",
  VOTE_SUBMISSION_FAILURE: "VOTE_SUBMISSION_FAILURE",
}

const addVote = vote => ({
  type: types.ADD_VOTE,
  vote,
})

const voteSubmissionFailure = optimisticUiVote => ({
  type: types.VOTE_SUBMISSION_FAILURE,
  optimisticUiVoteId: optimisticUiVote.id,
  error: { message: "Vote submission failed. Please try again." },
})

const buildOptimisticUiVote = snakeCaseVoteAttributes => {
  const optimisticUUID = uuidv4()

  return {
    id: optimisticUUID,
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

    push.receive("error", () => {
      const failureAction = voteSubmissionFailure(optimisticUiVote)
      dispatch(failureAction)
    })
  }
}

export const actions = {
  addVote,
  submitVote,
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.votes
    case types.ADD_VOTE:
      return [...state, action.vote]
    case types.VOTE_SUBMISSION_FAILURE:
      return state.filter(idea => idea.id !== action.optimisticUiVoteId)
    default:
      return state
  }
}

export const selectors = {
  voteCountForUser: ({ votes }, user) => {
    const votesForUser = votes.filter(vote => vote.user_id === user.id)
    return votesForUser.length
  },
}

export default reducer
