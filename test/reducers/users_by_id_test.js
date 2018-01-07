import deepFreeze from "deep-freeze"

import usersById from "../../web/static/js/reducers/users_by_id"

describe("usersById reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and no initial state is passed", () => {
      it("should return an empty object", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(usersById(undefined, {})).to.deep.equal({})
        expect(usersById(undefined, unhandledAction)).to.deep.equal({})
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = { id: 1 }
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(usersById(initialState, {})).to.deep.equal(initialState)
        expect(usersById(initialState, unhandledAction)).to.deep.equal(initialState)
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

        expect(usersById(undefined, action)).to.deep.equal({
          3: { id: 3, name: "Hilary" },
          5: { id: 5, name: "Timmy" },
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
            5: { id: 5, name: "Travis" }
          }

          expect(usersById(initialState, action)).to.deep.equal({
            5: { id: 5, name: "Travis" },
            60: { id: 60, name: "Kevin" },
            61: { id: 61, name: "Sarah" },
          })
        })
      })
    })
  })
})
