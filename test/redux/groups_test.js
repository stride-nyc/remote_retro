import deepFreeze from "deep-freeze"

import {
  reducer as groupsReducer,
  selectors,
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
  describe("groupsWithAssociatedIdeas", () => {
    describe("when there are no groups on state", () => {
      it("returns an empty list", () => {
        const state = {
          groups: [],
        }

        const result = selectors.groupsWithAssociatedIdeas(state)

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
        }

        const result = selectors.groupsWithAssociatedIdeas(state)
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
          }

          const result = selectors.groupsWithAssociatedIdeas(state)
          const group = result[0]

          expect(group).to.eql({
            id: 11,
            ideas: [{
              id: 1,
              group_id: 11,
            }, {
              id: 2,
              group_id: 11,
            }],
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
          }

          const result = selectors.groupsWithAssociatedIdeas(state)
          const group = result[0]

          expect(group).to.eql({
            id: 11,
            ideas: [],
          })
        })
      })
    })
  })
})
