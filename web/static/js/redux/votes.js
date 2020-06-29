import uuidv4 from "uuid/v4"
import keyBy from "lodash/keyBy"

import actionTypes from "./action_types"
import { VOTE_LIMIT } from "../configs/retro_configs"

const voteSubmission = vote => ({
  type: actionTypes.VOTE_SUBMISSION,
  vote,
})

const voteRetraction = vote => ({
  type: actionTypes.VOTE_RETRACTION_ACCEPTED,
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
    const addOptimisticUiVoteAction = voteSubmission(optimisticUiVote)
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

    dispatch({ type: actionTypes.VOTE_RETRACTION_SUBMITTED, vote })

    push.receive("error", () => {
      dispatch({ type: actionTypes.VOTE_RETRACTION_REJECTED, vote })
    })
  }
}

export const actions = {
  voteSubmission,
  voteRetraction,
  submitVote,
  submitVoteRetraction,
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case actionTypes.SET_INITIAL_STATE:
      return action.initialState.votes
    case actionTypes.VOTE_SUBMISSION:
    case actionTypes.VOTE_RETRACTION_REJECTED:
      return [...state, action.vote]
    case actionTypes.VOTE_SUBMISSION_ACCEPTED:
      return state.map(vote => {
        return vote.optimisticUUID === action.optimisticUUID ? action.persistedVote : vote
      })
    case actionTypes.VOTE_SUBMISSION_REJECTED:
      return state.filter(vote => vote.optimisticUUID !== action.optimisticUUID)
    case actionTypes.VOTE_RETRACTION_ACCEPTED:
    case actionTypes.VOTE_RETRACTION_SUBMITTED:
      return state.filter(vote => vote.id !== action.vote.id)
    default:
      return state
  }
}

const cumulativeVoteCountForUser = ({ votes }, user) => {
  const votesForUser = votes.filter(vote => vote.user_id === user.id)
  return votesForUser.length
}

export const selectors = {
  cumulativeVoteCountForUser,
  currentUserHasExhaustedVotes: (state, currentUser) => {
    if (!currentUser) return true

    const cumulativeVoteCountForCurrentUser = cumulativeVoteCountForUser(state, currentUser)
    return cumulativeVoteCountForCurrentUser >= VOTE_LIMIT
  },
  votesForIdea: ({ votes }, idea) => {
    return votes.filter(vote => vote.idea_id === idea.id)
  },
  votingStageProgressionTooltip: ({ votes, presences }) => {
    // presences can conain duplicate users if they have multiple retro tabs/windows open
    const dedupedUserIdsAsKeys = keyBy(presences, "user_id")

    const presentUserCount = Object.keys(dedupedUserIdsAsKeys).length
    const votesForPresentUsers = votes.filter(vote => dedupedUserIdsAsKeys[vote.user_id])

    const MAX_VOTE_COUNT_FOR_PRESENT_USERS = VOTE_LIMIT * presentUserCount

    return votesForPresentUsers.length >= MAX_VOTE_COUNT_FOR_PRESENT_USERS ? "All votes in!" : undefined
  },
}

export default reducer
