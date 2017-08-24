const userVoteCounter = (state = {}, action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return action.initialState.participations.reduce(
        (counter, participation) => {
          const counterCopy = { ...counter }
          counterCopy[participation.user_id] = participation.vote_count
          return counterCopy
        },
        {}
      )
    case "UPDATE_VOTE_COUNTER":
      return {
        ...state,
        [action.data.userId]: action.data.voteCount,
      }
    default:
      return state
  }
}

export default userVoteCounter
