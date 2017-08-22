import deepFreeze from "deep-freeze"
import userVoteCounter from "../../web/static/js/reducers/user_vote_counter"

describe("userVoteCounter reducer", () => {
  describe("when there is an empty action", () => {
    describe("when no new state is passed", () => {
      it("should return an empty object", () => {
        expect(userVoteCounter(undefined, {})).to.deep.equal({})
      })
    })
  })
})
