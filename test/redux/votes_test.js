import deepFreeze from "deep-freeze"
import sinon from "sinon"
import { setupMockPhoenixChannel } from "../support/js/test_helper"

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

  describe("when the action is RETRACT_VOTE", () => {
    it("removes the vote from the state", () => {
      const retractVoteAction = { type: "RETRACT_VOTE", vote: { id: 17 } }
      const initialState = [{ id: 17 }]
      deepFreeze(initialState)
      const result = votesReducer(initialState, retractVoteAction)
      expect(result).to.eql([])
    })
  })

  describe("when the action is VOTE_SUBMISSION_ACCEPTED", () => {
    it("replaces the vote with matching uuid, stripping the optimisticUUID property", () => {
      const initialState = [
        { optimisticUUID: "a374kdnvk3ndk", idea_id: 12, user_id: 33 },
        { id: 1, idea_id: 31, user_id: 24 },
      ]

      const action = {
        type: "VOTE_SUBMISSION_ACCEPTED",
        optimisticUUID: "a374kdnvk3ndk",
        persistedVote: { id: 2, idea_id: 12, user_id: 33 },
      }

      deepFreeze(initialState)
      const result = votesReducer(initialState, action)

      expect(result).to.eql([{
        id: 2,
        idea_id: 12,
        user_id: 33,
      }, {
        id: 1,
        idea_id: 31,
        user_id: 24,
      }])
    })
  })

  describe("when the action is VOTE_SUBMISSION_REJECTED", () => {
    it("removes the vote with matching uuid from the list", () => {
      const initialState = [
        { optimisticUUID: "a374kdnvk3ndk", idea_id: 12, user_id: 33 },
        { id: 1, idea_id: 31, user_id: 24 },
      ]

      const action = {
        type: "VOTE_SUBMISSION_REJECTED",
        optimisticUUID: "a374kdnvk3ndk",
      }

      deepFreeze(initialState)
      const result = votesReducer(initialState, action)

      expect(result).to.eql([{
        id: 1,
        idea_id: 31,
        user_id: 24,
      }])
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
  describe("cumulativeVoteCountForUser", () => {
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
      const cumulativeVoteCountForUser = selectors.cumulativeVoteCountForUser(state, user)
      expect(cumulativeVoteCountForUser).to.equal(2)
    })
  })

  describe("votesForIdea", () => {
    const state = {
      votes: [{
        user_id: 5, idea_id: 7,
      }, {
        user_id: 5, idea_id: 7,
      }, {
        user_id: 2, idea_id: 2,
      }],
    }

    const idea = { id: 7 }

    it("returns only the votes for the given idea", () => {
      const votesForIdea = selectors.votesForIdea(state, idea)
      expect(votesForIdea).to.deep.eql([{
        user_id: 5, idea_id: 7,
      }, {
        user_id: 5, idea_id: 7,
      }])
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
      let mockRetroChannel
      let dispatch

      beforeEach(() => {
        thunk = actions.submitVote(idea, user)
        mockRetroChannel = setupMockPhoenixChannel()
        dispatch = () => {}
      })

      it("dispatches the addVote action optimistically", () => {
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, undefined, mockRetroChannel)

        expect(dispatchSpy).calledWithMatch({ type: "ADD_VOTE" })
      })

      it("assigns a UUID to the optimistically added vote", () => {
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, undefined, mockRetroChannel)

        const invocationArguments = dispatchSpy.args[0]
        const addedVote = invocationArguments[0].vote

        expect(addedVote.optimisticUUID).to.be.a.uuid("v4")
      })

      it("calls retroChannel.push with 'vote_submitted', passing the idea and user ids as snakecased attributes", () => {
        const pushSpy = sinon.spy(mockRetroChannel, "push")

        thunk(dispatch, undefined, mockRetroChannel)

        expect(pushSpy).calledWith("vote_submitted", { idea_id: 10, user_id: 5 })

        pushSpy.restore()
      })

      describe("when the push results in an 'ok' response", () => {
        beforeEach(() => {
          mockRetroChannel = setupMockPhoenixChannel()
        })

        it("dispatches VOTE_SUBMISSION_ACCEPTED with the optimistic UUID and the persisted idea", () => {
          const dispatchSpy = sinon.spy()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          const invocationArguments = dispatchSpy.args[0]
          const optimisticallyAddedVote = invocationArguments[0].vote

          mockRetroChannel.__triggerReply("ok", { id: 1001, user_id: 1, idea_id: 3 })

          expect(dispatchSpy).calledWithMatch({
            type: "VOTE_SUBMISSION_ACCEPTED",
            optimisticUUID: optimisticallyAddedVote.optimisticUUID,
            persistedVote: { id: 1001, user_id: 1, idea_id: 3 },
          })
        })
      })

      describe("when the push results in an error", () => {
        beforeEach(() => {
          mockRetroChannel = setupMockPhoenixChannel()
        })

        it("dispatches a VOTE_SUBMISSION_REJECTED with the optimistic UUID", () => {
          const dispatchSpy = sinon.spy()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          const invocationArguments = dispatchSpy.args[0]
          const optimisticallyAddedVote = invocationArguments[0].vote

          mockRetroChannel.__triggerReply("error", {})

          expect(dispatchSpy).calledWithMatch({
            type: "VOTE_SUBMISSION_REJECTED",
            optimisticUUID: optimisticallyAddedVote.optimisticUUID,
          })
        })
      })
    })
  })

  describe("retractVote", () => {
    it("is a thunk", () => {
      const result = actions.submitVoteRetraction()
      expect(typeof result).to.equal("function")
    })

    describe("the returned thunk", () => {
      let thunk
      let dispatch
      let mockRetroChannel
      let vote
      let pushSpy

      beforeEach(() => {
        vote = { id: 21 }
        mockRetroChannel = setupMockPhoenixChannel()
        thunk = actions.submitVoteRetraction(vote)
      })

      it("calls retroChannel.push with 'vote_retracted', passing the given vote", () => {
        pushSpy = sinon.spy(mockRetroChannel, "push")
        thunk(dispatch, undefined, mockRetroChannel)

        expect(pushSpy).calledWith("vote_retracted", vote)
        pushSpy.restore()
      })

      describe("when the push results in an error", () => {
        it("dispatches a VOTE_RETRACTION_REJECTED with the optimistic UUID", () => {
          const dispatchSpy = sinon.spy()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          mockRetroChannel.__triggerReply("error", {})

          expect(dispatchSpy).calledWithMatch({
            type: "VOTE_RETRACTION_REJECTED",
          })
        })
      })
    })
  })
})
