const userVoteCounter = (state, action) => {
  const isSetInitialState = action.type === "SET_INITIAL_STATE"
  const hasParticipations = action.initialState && action.initialState.participations && action.initialState.participations.length > 0
  if (isSetInitialState && hasParticipations) {
    return action.initialState.participations.reduce(
      (counter, participation) => {
        const counterCopy = { ...counter }
        counterCopy[participation.user_id] = participation.vote_count
        return counterCopy
      },
      {}
    )
  }
  return {}
}

export default userVoteCounter
