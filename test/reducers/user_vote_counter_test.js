import userVoteCounter from "../../web/static/js/reducers/user_vote_counter"

describe("userVoteCounter reducer", () => {
  describe("when there is an empty action", () => {
    describe("when no new state is passed", () => {
      it("should return an empty object", () => {
        expect(userVoteCounter(undefined, {})).to.deep.equal({})
      })
    })
  })

  describe("when there is a 'ENGAGE_LUNAR_LANDING' action", () => {
    context("when there is one participation", () => {
      it("should return an empty object", () => {
        const action = {
          type: "ENGAGE_LUNAR_LANDING",
          initialState: {
            participations: [{ user_id: 1, vote_count: 3 }],
          },
        }
        expect(userVoteCounter(undefined, action)).to.deep.equal({})
      })
    })
  })

  describe("when there is an unrecognized action type", () => {
    context("when there is one participation", () => {
      it("should return an empty object", () => {
        const action = {
          type: "BOOGIEWOOGIE",
          initialState: {
            participations: [{ user_id: 1, vote_count: 3 }],
          },
        }
        expect(userVoteCounter(undefined, action)).to.deep.equal({})
      })
    })
  })

  describe("when there is a 'SET_INITIAL_STATE' action", () => {
    context("when there are no participations", () => {
      it("should return an empty object", () => {
        const action = { type: "SET_INITIAL_STATE", initialState: { participations: [] } }
        expect(userVoteCounter(undefined, action)).to.deep.equal({})
      })
    })

    context("when there is one participation", () => {
      it("should return an object with the user_id as key and vote_count as value", () => {
        const action = {
          type: "SET_INITIAL_STATE",
          initialState: {
            participations: [{ user_id: 1, vote_count: 3 }],
          },
        }
        expect(userVoteCounter(undefined, action)).to.deep.equal({ 1: 3 })
      })
    })

    context("when there are two participations", () => {
      it("should return an object with two keys that are the user_ids and two values that are the vote_counts", () => {
        const action = {
          type: "SET_INITIAL_STATE",
          initialState: {
            participations: [{ user_id: 1, vote_count: 3 }, { user_id: 2, vote_count: 5 }],
          },
        }
        expect(userVoteCounter(undefined, action)).to.deep.equal({ 1: 3, 2: 5 })
      })
    })
  })
})
