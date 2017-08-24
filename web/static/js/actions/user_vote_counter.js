export default function updateVoteCounter(userId, voteCount) {
  return {
    type: "UPDATE_VOTE_COUNTER",
    data: {
      userId,
      voteCount,
    },
  }
}
