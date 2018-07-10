const types = {
  ADD_VOTE: "ADD_VOTE",
}

export const actions = {
  addVote: vote => ({
    type: types.ADD_VOTE,
    vote,
  }),
}

export const reducer = (state = [], action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.votes
    case types.ADD_VOTE:
      return [...state, action.vote]
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
