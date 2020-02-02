import deepFreeze from "deep-freeze"
import sinon from "sinon"
import { setupMockRetroChannel } from "../support/js/test_helper"

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

  describe("when the action is VOTE_SUBMISSION", () => {
    it("adds the vote to state", () => {
      const voteSubmissionAction = { type: "VOTE_SUBMISSION", vote: { idea_id: 12, user_id: 33 } }
      const initialState = []
      deepFreeze(initialState)
      const result = votesReducer(initialState, voteSubmissionAction)
      expect(result).to.eql([{ idea_id: 12, user_id: 33 }])
    })
  })

  describe("when the action is VOTE_RETRACTION", () => {
    it("removes the vote from the state", () => {
      const voteRetraction = { type: "VOTE_RETRACTION", vote: { id: 17 } }
      const initialState = [{ id: 17 }]
      deepFreeze(initialState)
      const result = votesReducer(initialState, voteRetraction)
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

  describe("currentUserHasExhaustedVotes", () => {
    describe("when the currentUser presence has yet to be derived by the server in the milliseconds after persisted state is set clientside", () => {
      it("returns true to disabled voting for the interim", () => {
        const state = {
          votes: [],
        }

        const currentUser = null

        const result = selectors.currentUserHasExhaustedVotes(state, currentUser)
        expect(result).to.equal(true)
      })
    })

    describe("when the current user hasn't voted", () => {
      it("they haven't exhausted their votes", () => {
        const state = {
          votes: [],
        }

        const currentUser = { id: 5 }

        const result = selectors.currentUserHasExhaustedVotes(state, currentUser)
        expect(result).to.equal(false)
      })
    })

    describe("when the current user has voted twice", () => {
      it("they haven't exhausted their votes", () => {
        const state = {
          votes: [{
            user_id: 6,
          }, {
            user_id: 6,
          }],
        }

        const currentUser = { id: 6 }

        const result = selectors.currentUserHasExhaustedVotes(state, currentUser)
        expect(result).to.equal(false)
      })
    })

    describe("when the current user has voted three times", () => {
      const state = {
        votes: [{
          user_id: 11,
        }, {
          user_id: 11,
        }, {
          user_id: 11,
        }],
      }

      const currentUser = { id: 11 }

      it("the currentUser has exhausted their votes", () => {
        const result = selectors.currentUserHasExhaustedVotes(state, currentUser)
        expect(result).to.equal(true)
      })
    })

    // we should be protected against this case upstream, due to instantaneous disablement of the
    // voting interface on vote *submission* of a third vote, but we protect ourselves nonetheless,
    // as this test drives the behavior that vote count must be *less* than three votes for a user
    // to vote, rather than having a vote count that isn't *equal* to three
    describe("in a scenario where the current user has somehow voted more than three times", () => {
      const state = {
        votes: [{
          user_id: 13,
        }, {
          user_id: 13,
        }, {
          user_id: 13,
        }, {
          user_id: 13,
        }],
      }

      const currentUser = { id: 13 }

      it("the currentUser has exhausted their votes", () => {
        const result = selectors.currentUserHasExhaustedVotes(state, currentUser)
        expect(result).to.equal(true)
      })
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
        mockRetroChannel = setupMockRetroChannel()
        dispatch = () => {}
      })

      it("dispatches the voteSubmission action optimistically", () => {
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, undefined, mockRetroChannel)

        expect(dispatchSpy).calledWithMatch({ type: "VOTE_SUBMISSION" })
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
          mockRetroChannel = setupMockRetroChannel()
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
          mockRetroChannel = setupMockRetroChannel()
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

  describe("voteRetraction", () => {
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
        mockRetroChannel = setupMockRetroChannel()
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
