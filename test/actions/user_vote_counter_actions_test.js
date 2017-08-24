import updateVoteCounter from "../../web/static/js/actions/user_vote_counter"

describe("updateVoteCounter", () => {
  it("returns an action with a type of 'UPDATE_VOTE_COUNTER' and a data object with userId and voteCount", () => {
    expect(updateVoteCounter(1, 5)).to.deep.equal({
      type: "UPDATE_VOTE_COUNTER",
      data: {
        userId: 1,
        voteCount: 5,
      },
    })
  })
})
