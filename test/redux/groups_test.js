import deepFreeze from "deep-freeze"
import { spy } from "sinon"

import {
  reducer as groupsReducer,
  selectors,
  actionCreators,
} from "../../web/static/js/redux/groups"

describe("groups reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("should return an empty array", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(groupsReducer(undefined, {})).to.deep.equal([])
        expect(groupsReducer(undefined, unhandledAction)).to.deep.equal([])
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = [{ id: 5, name: "communication" }]
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(groupsReducer(initialState, {})).to.deep.equal(initialState)
        expect(groupsReducer(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })

  describe("the handled actions", () => {
    describe("when the action is SET_INITIAL_STATE", () => {
      it("should replace the state with the groups passed in the action's inialState object", () => {
        const initialState = []
        deepFreeze(initialState)

        const groups = [{ id: 5, name: "ceremonies" }]
        const action = { type: "SET_INITIAL_STATE", initialState: { groups } }

        expect(groupsReducer(initialState, action)).to.deep.equal([...groups])
      })
    })

    describe("when the action is RETRO_STAGE_PROGRESSION_COMMITTED", () => {
      context("when the payload contains data for groups", () => {
        it("should replace the state with the groups passed in the action's payload", () => {
          const initialState = []
          deepFreeze(initialState)

          const groups = [{ id: 7, name: "the build" }]
          const action = { type: "RETRO_STAGE_PROGRESSION_COMMITTED", payload: { groups } }

          expect(groupsReducer(initialState, action)).to.deep.equal([...groups])
        })
      })

      context("when the payload *lacks* groups data", () => {
        it("leaves the state unchanged", () => {
          const initialState = []
          deepFreeze(initialState)

          const action = { type: "RETRO_STAGE_PROGRESSION_COMMITTED", payload: {} }

          expect(groupsReducer(initialState, action)).to.deep.equal(initialState)
        })
      })
    })
  })
})

describe("selectors", () => {
  describe("groupsWithAssociatedIdeasAndVotes", () => {
    describe("when there are no groups on state", () => {
      it("returns an empty list", () => {
        const state = {
          groups: [],
          ideas: [],
          votes: [],
        }

        const result = selectors.groupsWithAssociatedIdeasAndVotes(state)

        expect(result).to.eql([])
      })
    })

    describe("when are groups on state", () => {
      it("returns a list based on the groups on state", () => {
        const state = {
          groups: [
            { id: 11 },
            { id: 19 },
          ],
          ideas: [],
          votes: [],
        }

        const result = selectors.groupsWithAssociatedIdeasAndVotes(state)
        const ids = result.map(group => group.id)

        expect(ids).to.eql([11, 19])
      })

      describe("when there are ideas on state whose group_id matches a group on state", () => {
        it("associates the group with the ideas", () => {
          const state = {
            groups: [
              { id: 11 },
            ],
            ideas: [{
              id: 1,
              group_id: 11,
            }, {
              id: 2,
              group_id: 11,
            }],
            votes: [],
          }

          const result = selectors.groupsWithAssociatedIdeasAndVotes(state)
          const group = result[0]

          expect(group.ideas).to.eql([{
            id: 1,
            group_id: 11,
          }, {
            id: 2,
            group_id: 11,
          }])
        })

        describe("when there are no votes on state", () => {
          it("adds an empty votes association", () => {
            const state = {
              groups: [
                { id: 20 },
              ],
              ideas: [{
                id: 1,
                group_id: 20,
              }],
              votes: [],
            }

            const result = selectors.groupsWithAssociatedIdeasAndVotes(state)
            const group = result[0]

            expect(group.votes).to.eql([])
          })
        })

        describe("when there *are* votes on state", () => {
          describe("when none of the votes are associated with group's associated ideas", () => {
            it("does not add any of the votes to the given group", () => {
              const state = {
                groups: [
                  { id: 20 },
                ],
                ideas: [{
                  id: 1,
                  group_id: 20,
                }],
                votes: [{ id: 5, idea_id: 99 }],
              }

              const result = selectors.groupsWithAssociatedIdeasAndVotes(state)
              const group = result[0]

              expect(group.votes).to.eql([])
            })
          })
        })

        describe("when there are votes associated with the given ideas", () => {
          it("includes those votes in the group's 'votes' association", () => {
            const state = {
              groups: [
                { id: 20 },
              ],
              ideas: [{
                id: 1,
                group_id: 20,
              }],
              votes: [{ id: 5, idea_id: 1 }],
            }

            const result = selectors.groupsWithAssociatedIdeasAndVotes(state)
            const group = result[0]

            expect(group.votes).to.eql([{
              id: 5,
              idea_id: 1,
            }])
          })
        })
      })

      describe("when there are ideas on state whose group_ids don't match a given group", () => {
        it("does *not* associate the ideas with the group, but adds the empty association", () => {
          const state = {
            groups: [
              { id: 11 },
            ],
            ideas: [{
              id: 1,
              group_id: 20,
            }, {
              id: 2,
              group_id: 99,
            }],
            votes: [],
          }

          const result = selectors.groupsWithAssociatedIdeasAndVotes(state)
          const group = result[0]

          expect(group.ideas).to.eql([])
        })
      })
    })
  })
})

describe("action creators", () => {
  describe("submitGroupNameChanges", () => {
    let dispatchStub
    let getStateStub
    let mockRetroChannel

    beforeEach(() => {
      dispatchStub = () => {}
      getStateStub = () => {}
      mockRetroChannel = { push: spy() }
    })

    describe("when the given string is *different* than the existing group name", () => {
      it("pushes an 'update_group_name' event to the server, passing the id and updated value", () => {
        const groupArguments = { id: 666, name: "steven's domain" }
        const thunk = actionCreators.submitGroupNameChanges(groupArguments, "steven's NEW domain")

        thunk(dispatchStub, getStateStub, mockRetroChannel)

        expect(mockRetroChannel.push).to.have.been.calledWith("update_group_name", { id: 666, name: "steven's NEW domain" })
      })
    })

    describe("when the given string is identical to the existing group name", () => {
      it("pushes nothing to the server", () => {
        const groupArguments = { id: 555, name: "travis" }
        const thunk = actionCreators.submitGroupNameChanges(groupArguments, "travis")

        thunk(dispatchStub, getStateStub, mockRetroChannel)

        expect(mockRetroChannel.push).not.to.have.been.called
      })
    })
  })
})
