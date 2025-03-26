import deepFreeze from "deep-freeze"
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
        expect(votesReducer(undefined, {})).toEqual([])
      })
    })
  })

  describe("when the action is VOTE_SUBMISSION", () => {
    it("adds the vote to state", () => {
      const voteSubmissionAction = { type: "VOTE_SUBMISSION", vote: { idea_id: 12, user_id: 33 } }
      const initialState = []
      deepFreeze(initialState)
      const result = votesReducer(initialState, voteSubmissionAction)
      expect(result).toEqual([{ idea_id: 12, user_id: 33 }])
    })
  })

  describe("when the action is VOTE_RETRACTION_REJECTED", () => {
    it("adds the vote to state", () => {
      const voteSubmissionAction = { type: "VOTE_RETRACTION_REJECTED", vote: { idea_id: 99, user_id: 11 } }
      const initialState = []
      deepFreeze(initialState)
      const result = votesReducer(initialState, voteSubmissionAction)
      expect(result).toEqual([{ idea_id: 99, user_id: 11 }])
    })
  })

  describe("when the action is VOTE_RETRACTION_SUBMITTED", () => {
    it("removes the vote from the state", () => {
      const voteRetraction = { type: "VOTE_RETRACTION_SUBMITTED", vote: { id: 19 } }
      const initialState = [{ id: 19 }]
      deepFreeze(initialState)
      const result = votesReducer(initialState, voteRetraction)
      expect(result).toEqual([])
    })

    it("does *not* remove non-matching votes from the state", () => {
      const voteRetraction = { type: "VOTE_RETRACTION_SUBMITTED", vote: { id: 99 } }
      const voteWithIdOne = { id: 1 }
      const initialState = [voteWithIdOne, { id: 99 }]
      deepFreeze(initialState)
      const result = votesReducer(initialState, voteRetraction)

      expect(result).toContain(voteWithIdOne)
    })
  })

  describe("when the action is VOTE_RETRACTION_ACCEPTED", () => {
    it("removes the vote from the state", () => {
      const voteRetraction = { type: "VOTE_RETRACTION_ACCEPTED", vote: { id: 17 } }
      const initialState = [{ id: 17 }]
      deepFreeze(initialState)
      const result = votesReducer(initialState, voteRetraction)
      expect(result).toEqual([])
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

      expect(result).toEqual([{
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

      expect(result).toEqual([{
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

      expect(result).toEqual([
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
      expect(cumulativeVoteCountForUser).toBe(2)
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
        expect(result).toBe(true)
      })
    })

    describe("when the current user hasn't voted", () => {
      it("they haven't exhausted their votes", () => {
        const state = {
          votes: [],
        }

        const currentUser = { id: 5 }

        const result = selectors.currentUserHasExhaustedVotes(state, currentUser)
        expect(result).toBe(false)
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
        expect(result).toBe(false)
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
        expect(result).toBe(true)
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
        expect(result).toBe(true)
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
      expect(votesForIdea).toEqual([{
        user_id: 5, idea_id: 7,
      }, {
        user_id: 5, idea_id: 7,
      }])
    })
  })

  describe("votingStageProgressionTooltip", () => {
    describe("when there's a lone presence", () => {
      describe("when there are no votes for the lone presence", () => {
        it("returns nothing", () => {
          const reduxState = {
            votes: [],
            presences: [{ user_id: 2 }],
          }

          const result = selectors.votingStageProgressionTooltip(reduxState)

          expect(result).toEqual(undefined)
        })
      })

      describe("when there are two votes associated with the lone user presence", () => {
        it("returns nothing", () => {
          const reduxState = {
            votes: [{
              id: 100, user_id: 2,
            }, {
              id: 101, user_id: 2,
            }],
            presences: [{ user_id: 2 }],
          }

          const result = selectors.votingStageProgressionTooltip(reduxState)

          expect(result).toEqual(undefined)
        })

        describe("when and there are votes associated with a user who *isn't* present", () => {
          it("returns nothing", () => {
            const reduxState = {
              votes: [{
                id: 100, user_id: 99,
              }, {
                id: 101, user_id: 2,
              }, {
                id: 102, user_id: 2,
              }],
              presences: [{ user_id: 2 }],
            }

            const result = selectors.votingStageProgressionTooltip(reduxState)

            expect(result).toEqual(undefined)
          })
        })
      })

      describe("when there are three votes associated with the lone user presence", () => {
        describe("when there are no votes for other users", () => {
          it("signals that all votes have been submitted", () => {
            const reduxState = {
              votes: [{
                id: 100, user_id: 2,
              }, {
                id: 101, user_id: 2,
              }, {
                id: 102, user_id: 2,
              }],
              presences: [{ user_id: 2 }],
            }

            const result = selectors.votingStageProgressionTooltip(reduxState)

            expect(result).toEqual("All votes in!")
          })
        })

        describe("when there are votes for other users who *aren't* present", () => {
          it("signals that all votes have been submitted, even if the other user didn't have 3 total, because they are not around!", () => {
            const reduxState = {
              votes: [{
                id: 100, user_id: 2,
              }, {
                id: 101, user_id: 2,
              }, {
                id: 102, user_id: 2,
              }, {
                id: 103, user_id: 99,
              }],
              presences: [{ user_id: 2 }],
            }

            const result = selectors.votingStageProgressionTooltip(reduxState)

            expect(result).toEqual("All votes in!")
          })
        })
      })
    })

    describe("when there are multiple presences", () => {
      describe("and the presences represent different users", () => {
        describe("and one user has submitted three votes, but the other is short of three votes", () => {
          it("returns nothing", () => {
            const reduxState = {
              votes: [{
                id: 100, user_id: 2,
              }, {
                id: 101, user_id: 2,
              }, {
                id: 102, user_id: 2,
              }],
              presences: [{ user_id: 2 }, { user_id: 3 }],
            }

            const result = selectors.votingStageProgressionTooltip(reduxState)

            expect(result).toEqual(undefined)
          })
        })

        describe("when each distinct user has submitted three votes", () => {
          it("signals that all votes have been submitted", () => {
            const reduxState = {
              votes: [
                { id: 100, user_id: 2 },
                { id: 101, user_id: 2 },
                { id: 102, user_id: 2 },
                { id: 103, user_id: 5 },
                { id: 104, user_id: 5 },
                { id: 105, user_id: 5 },
              ],

              presences: [{ user_id: 2 }, { user_id: 5 }],
            }

            const result = selectors.votingStageProgressionTooltip(reduxState)

            expect(result).toEqual("All votes in!")
          })
        })
      })

      describe("and the presences contain duplicate user records, as can happen when the user has two browser windows open", () => {
        describe("and that one user has submitted three votes", () => {
          it("signals that all votes have been submitted", () => {
            const reduxState = {
              votes: [{
                id: 100, user_id: 2,
              }, {
                id: 101, user_id: 2,
              }, {
                id: 102, user_id: 2,
              }],
              presences: [{ user_id: 2 }, { user_id: 2 }],
            }

            const result = selectors.votingStageProgressionTooltip(reduxState)

            expect(result).toEqual("All votes in!")
          })
        })
      })
    })
  })
})

describe("actions", () => {
  describe("submitVote", () => {
    const idea = { id: 10 }
    const user = { id: 5 }

    it("is a thunk", () => {
      const result = actions.submitVote()
      expect(typeof result).toBe("function")
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
        const dispatchSpy = jest.fn()
        thunk(dispatchSpy, undefined, mockRetroChannel)

        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "VOTE_SUBMISSION" }))
      })

      it("assigns a UUID to the optimistically added vote", () => {
        const dispatchSpy = jest.fn()
        thunk(dispatchSpy, undefined, mockRetroChannel)

        const invocationArguments = dispatchSpy.mock.calls[0]
        const addedVote = invocationArguments[0].vote

        // Using a regex to check for UUID v4 format
        expect(addedVote.optimisticUUID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      })

      it("calls retroChannel.push with 'vote_submitted', passing the idea and user ids as snakecased attributes", () => {
        thunk(dispatch, undefined, mockRetroChannel)

        expect(mockRetroChannel.push).toHaveBeenCalledWith("vote_submitted", { idea_id: 10, user_id: 5 })
      })

      describe("when the push results in an 'ok' response", () => {
        beforeEach(() => {
          mockRetroChannel = setupMockRetroChannel()
        })

        it("dispatches VOTE_SUBMISSION_ACCEPTED with the optimistic UUID and the persisted idea", () => {
          const dispatchSpy = jest.fn()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          const invocationArguments = dispatchSpy.mock.calls[0]
          const optimisticallyAddedVote = invocationArguments[0].vote

          mockRetroChannel.__triggerReply("ok", { id: 1001, user_id: 1, idea_id: 3 })

          expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: "VOTE_SUBMISSION_ACCEPTED",
            optimisticUUID: optimisticallyAddedVote.optimisticUUID,
            persistedVote: { id: 1001, user_id: 1, idea_id: 3 },
          }))
        })
      })

      describe("when the push results in an error", () => {
        beforeEach(() => {
          mockRetroChannel = setupMockRetroChannel()
        })

        it("dispatches a VOTE_SUBMISSION_REJECTED with the optimistic UUID", () => {
          const dispatchSpy = jest.fn()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          const invocationArguments = dispatchSpy.mock.calls[0]
          const optimisticallyAddedVote = invocationArguments[0].vote

          mockRetroChannel.__triggerReply("error", {})

          expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: "VOTE_SUBMISSION_REJECTED",
            optimisticUUID: optimisticallyAddedVote.optimisticUUID,
          }))
        })
      })
    })
  })

  describe("voteRetraction", () => {
    it("is a thunk", () => {
      const result = actions.submitVoteRetraction()
      expect(typeof result).toBe("function")
    })

    describe("the returned thunk", () => {
      let thunk
      let dispatch
      let mockRetroChannel
      let vote

      beforeEach(() => {
        dispatch = () => {}
        vote = { id: 21 }
        mockRetroChannel = setupMockRetroChannel()
        thunk = actions.submitVoteRetraction(vote)
      })

      it("initiates the removal of the vote from local state", () => {
        const dispatchSpy = jest.fn()
        thunk(dispatchSpy, undefined, mockRetroChannel)

        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
          type: "VOTE_RETRACTION_SUBMITTED",
          vote,
        }))
      })

      it("calls retroChannel.push with 'vote_retracted', passing the given vote", () => {
        thunk(dispatch, undefined, mockRetroChannel)

        expect(mockRetroChannel.push).toHaveBeenCalledWith("vote_retracted", vote)
      })

      describe("when the push results in an error", () => {
        it("dispatches a VOTE_RETRACTION_REJECTED, including the vote for re-addition to the local store", () => {
          const dispatchSpy = jest.fn()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          mockRetroChannel.__triggerReply("error", {})

          expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: "VOTE_RETRACTION_REJECTED",
            vote,
          }))
        })
      })
    })
  })
})
