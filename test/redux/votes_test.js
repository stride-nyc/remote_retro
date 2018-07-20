import deepFreeze from "deep-freeze"
import sinon from "sinon"
import {
  reducer as votesReducer,
  selectors,
  actions,
} from "../../web/static/js/redux/votes"

describe("votes reducer", () => {
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

  describe("when the action is SET_INITIAL_STATE", () => {
    it("returns the initial state's votes", () => {
      const initialStateAction = {
        type: "SET_INITIAL_STATE",
        initialState: {
          votes: [
            { idea_id: 12, user_id: 33 },
            { idea_id: 31, user_id: 24 },
          ],
        },
      }

      const initialState = []
      deepFreeze(initialState)
      const result = votesReducer(["some_other_state"], initialStateAction)

      expect(result).to.eql([
        { idea_id: 12, user_id: 33 },
        { idea_id: 31, user_id: 24 },
      ])
    })
  })
})

describe("selectors", () => {
  describe("voteCountForUser", () => {
    const state = {
      votes: [{
        user_id: 5, idea_id: 7,
      }, {
        user_id: 5, idea_id: 7,
      }, {
        user_id: 2, idea_id: 2,
      }],
    }

    const user = { id: 5 }

    it("returns the number of votes the given user has on the store", () => {
      const voteCountForUser = selectors.voteCountForUser(state, user)
      expect(voteCountForUser).to.equal(2)
    })
  })
})

describe("actions", () => {
  describe("submitVote", () => {
    const idea = { id: 10 }
    const user = { id: 5 }

    it("is a thunk", () => {
      const result = actions.submitVote()
      expect(typeof result).to.equal("function")
    })

    describe("the returned thunk", () => {
      let thunk

      beforeEach(() => {
        thunk = actions.submitVote(idea, user)
      })

      it("calls retroChannel.push with 'vote_submitted', passing the idea and user ids as snakecased attributes", () => {
        const pushSpy = sinon.spy()
        const retroChannelMock = {
          push: pushSpy,
        }

        thunk(undefined, undefined, retroChannelMock)

        expect(
          pushSpy.calledWith("vote_submitted", { idea_id: 10, user_id: 5 })
        ).to.be.true
      })
    })
  })
})
