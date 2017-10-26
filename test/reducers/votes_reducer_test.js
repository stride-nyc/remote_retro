import deepFreeze from "deep-freeze"
import votesReducer from "../../web/static/js/reducers/votes"

describe("user reducer", () => {
  describe("when there is an empty action", () => {
    describe("when no new state is passed", () => {
      it("should return the initial state of an empty array", () => {
        expect(votesReducer(undefined, {})).to.deep.equal([])
      })
    })
  })

  describe("when the action is ADD_VOTE", () => {
    it("adds the vote to state", () => {
      const addVoteAction = { type: "ADD_VOTE", vote: { idea_id: 12, user_id: 33 } }
      const initialState = []
      deepFreeze(initialState)
      const result = votesReducer(initialState, addVoteAction)
      expect(result).to.eql([{ idea_id: 12, user_id: 33 }])
    })
  })
})
