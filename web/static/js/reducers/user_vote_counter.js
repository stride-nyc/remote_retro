const userVoteCounter = (state, action) => {
  if (action.participations && action.participations.length > 0) {
    return action.participations.reduce(
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
