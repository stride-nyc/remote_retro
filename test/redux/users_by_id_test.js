import deepFreeze from "deep-freeze"

import {
  reducer,
  selectors,
} from "../../web/static/js/redux/users_by_id"

describe("selectors", () => {
  describe("getUserById", () => {
    context("when the user with the specified id exists in state", () => {
      const state = {
        usersById: {
          1: { id: 1, name: "Betty White" },
          2: { id: 2, name: "Rue McClanahan" },
          3: { id: 3, name: "Estelle Getty" },
        },
      }

      const userId = 1

      it("should select the user with the given userId", () => {
        expect(selectors.getUserById(state, userId)).to.eql({
          id: 1,
          name: "Betty White",
        })
      })
    })
  })
})

describe("usersById reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and no initial state is passed", () => {
      it("should return an empty object", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(reducer(undefined, {})).to.deep.equal({})
        expect(reducer(undefined, unhandledAction)).to.deep.equal({})
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = { id: 1 }
        deepFreeze(initialState)

        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(reducer(initialState, {})).to.deep.equal(initialState)
        expect(reducer(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })

  describe("the handled actions", () => {
    describe("when the action is SET_INITIAL_STATE", () => {
      it("returns a key-value object where the ids are keys and point to the full user object", () => {
        const action = {
          type: "SET_INITIAL_STATE",
          initialState: {
            users: [
              { id: 5, name: "Timmy" },
              { id: 3, name: "Hilary" },
            ],
          },
        }

        expect(reducer(undefined, action)).to.deep.equal({
          3: { id: 3, name: "Hilary" },
          5: { id: 5, name: "Timmy" },
        })
      })
    })

    describe("when the action is SET_PRESENCES", () => {
      describe("when presence state datastructure is empty", () => {
        const action = {
          type: "SET_PRESENCES",
          users: [
            { id: 6, name: "Kevin" },
            { id: 7, name: "Blurg Man" },
          ],
        }

        it("is populated with the users passed, their ids becoming state keys", () => {
          const initialState = {}
          deepFreeze(initialState)

          expect(reducer(initialState, action)).to.deep.equal({
            6: { id: 6, name: "Kevin" },
            7: { id: 7, name: "Blurg Man" },
          })
        })
      })

      describe("when presence state datastructure contains users already on state", () => {
        const action = {
          type: "SET_PRESENCES",
          users: [
            { id: 6, name: "Kevin" },
            { id: 7, name: "Blurg Man" },
          ],
        }

        it("merges the users info into the usersById datastructure", () => {
          const initialState = {
            7: { id: 7, name: "Travis" },
          }

          deepFreeze(initialState)

          expect(reducer(initialState, action)).to.deep.equal({
            6: { id: 6, name: "Kevin" },
            7: { id: 7, name: "Blurg Man" },
          })
        })
      })
    })

    describe("when the action is SYNC_PRESENCE_DIFF", () => {
      describe("when presenceDiff contains 'joins'", () => {
        const action = {
          type: "SYNC_PRESENCE_DIFF",
          presenceDiff: {
            joins: {
              ABC: { user: { id: 60, name: "Kevin" } },
              XYZ: { user: { id: 61, name: "Sarah" } },
            },
            leaves: {},
          },
        }

        it("adds users who have 'joined' to the state", () => {
          const initialState = {
            5: { id: 5, name: "Travis" },
          }

          expect(reducer(initialState, action)).to.deep.equal({
            5: { id: 5, name: "Travis" },
            60: { id: 60, name: "Kevin" },
            61: { id: 61, name: "Sarah" },
          })
        })
      })
    })
  })
})
