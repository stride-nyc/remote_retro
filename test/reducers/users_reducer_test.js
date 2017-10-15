import deepFreeze from "deep-freeze"
import usersReducer from "../../web/static/js/reducers/users"

describe("user reducer", () => {
  describe("when there is an empty action", () => {
    describe("when no new state is passed", () => {
      it("should return the initial state of an empty array", () => {
        expect(usersReducer(undefined, {})).to.deep.equal([])
      })
    })
  })

  describe("when action is SET_USERS", () => {
    const users = [{
      token: "abc",
      online_at: 2,
    }, {
      token: "123",
      online_at: 1,
    }]

    deepFreeze(users)

    describe("when there is existing state", () => {
      const action = { type: "SET_USERS", users }

      it("adds users in the action to state, assigning facilitatorship to earliest arrival", () => {
        const newState = usersReducer([], action)
        const tokens = newState.map(user => user.token)
        expect(tokens).to.deep.equal(["abc", "123"])
      })

      it("assigns the facilitator role only to the user who's been online longest", () => {
        expect(usersReducer([], action)).to.deep.equal([{
          token: "abc",
          online_at: 2,
          is_facilitator: false,
        }, {
          token: "123",
          online_at: 1,
          is_facilitator: true,
        }])
      })
    })

    describe("when the action is unhandled", () => {
      const action = { type: "IHAVENOIDEAWHATSHAPPENING" }

      it("returns the previous state", () => {
        expect(usersReducer([{ given_name: "Morty" }], action)).to.deep.equal([{ given_name: "Morty" }])
      })
    })
  })

  describe("when action is SYNC_PRESENCE_DIFF", () => {
    describe("and the presence diff represents users joining", () => {
      context("when the user is not already tracked in the users list", () => {
        const presenceDiff = {
          joins: {
            ABC: { user: { name: "Kevin", online_at: 10, token: "ABC" } },
            XYZ: { user: { name: "Sarah", online_at: 20, token: "XYZ" } },
          },
          leaves: {},
        }

        deepFreeze(presenceDiff)

        const action = { type: "SYNC_PRESENCE_DIFF", presenceDiff }

        it("adds all of the users to state", () => {
          const names = usersReducer([], action).map(user => user.name)
          expect(names).to.eql(["Kevin", "Sarah"])
        })
      })

      context("and the user is already tracked in the users list", () => {
        const presenceDiff = {
          joins: {
            ABC: { user: { name: "Kevin", online_at: 10, token: "ABC" } },
          },
          leaves: {},
        }

        deepFreeze(presenceDiff)

        const action = { type: "SYNC_PRESENCE_DIFF", presenceDiff }

        it("does not add a duplicate to the users list", () => {
          const usersListAlreadyContainingUser = [{ token: "ABC", name: "Kevin", online_at: 10 }]
          const names = usersReducer(usersListAlreadyContainingUser, action).map(user => user.name)
          expect(names).to.eql(["Kevin"])
        })
      })
    })

    describe("and the presence diff represents several users on state leaving", () => {
      const presenceDiff = {
        joins: {},
        leaves: {
          someLeaverTokenOne: { user: { name: "Kevin", token: "someLeaverTokenOne" } },
          someLeaverTokenTwo: { user: { name: "Sarah", token: "someLeaverTokenTwo" } },
        },
      }

      const initialState = [{
        name: "Kevin",
        online_at: 300,
        is_facilitator: false,
        token: "someLeaverTokenOne",
      }, {
        name: "Sarah",
        online_at: 100,
        is_facilitator: true,
        token: "someLeaverTokenTwo",
      }, {
        name: "Travy",
        online_at: 500,
        is_facilitator: false,
        token: "TOTALLY_COOL_TOKEN!",
      }]

      deepFreeze(presenceDiff)
      deepFreeze(initialState)

      const action = { type: "SYNC_PRESENCE_DIFF", presenceDiff }

      it("removes all of the users who have left", () => {
        const newState = usersReducer(initialState, action)
        const tokens = newState.map(user => user.token)
        expect(tokens).to.eql(["TOTALLY_COOL_TOKEN!"])
      })

      it("ensures the facilitatorship is transferred to the longest tenured", () => {
        const newState = usersReducer(initialState, action)
        expect(newState[0].is_facilitator).to.equal(true)
      })
    })
  })

  describe("When action is UPDATE_PRESENCE", () => {
    const userToken = "abc123"
    const newAttributes = { age: 70 }
    const action = { type: "UPDATE_PRESENCE", userToken, newAttributes }
    const initialState = [{ token: "abc123", name: "Tiny Rick", age: 180 }, { token: "zzz444", name: "Morty", age: 15 }]
    deepFreeze(initialState)
    const newState = usersReducer(initialState, action)

    it("should update user with matching token with new attributes", () => {
      expect(newState).to.deep.equal([{ token: "abc123", name: "Tiny Rick", age: 70 }, { token: "zzz444", name: "Morty", age: 15 }])
    })
  })

  describe("When action is UPDATE_USER", () => {
    const userId = 5
    const newAttributes = { vote_count: 4 }
    const action = { type: "UPDATE_USER", userId, newAttributes }
    const initialState = [{ id: 5, name: "Bob", vote_count: 3 }, { id: 7, name: "Lacy", vote_count: 2 }]
    deepFreeze(initialState)
    const newState = usersReducer(initialState, action)

    it("should update user with matching id with new attributes", () => {
      expect(newState).to.deep.equal([{ id: 5, name: "Bob", vote_count: 4 }, { id: 7, name: "Lacy", vote_count: 2 }])
    })
  })
})
