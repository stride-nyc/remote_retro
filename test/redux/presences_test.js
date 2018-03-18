import deepFreeze from "deep-freeze"
import {
  reducer as presencesReducer,
  actions as actionCreators,
  selectors,
} from "../../web/static/js/redux/presences"

describe("presences reducer", () => {
  describe("when there is an empty action", () => {
    describe("when no new state is passed", () => {
      it("should return the initial state of an empty array", () => {
        expect(presencesReducer(undefined, {})).to.deep.equal([])
      })
    })
  })

  describe("when action is SET_PRESENCES", () => {
    const presences = [{
      token: "abc",
      online_at: 2,
    }, {
      token: "123",
      online_at: 1,
    }]

    deepFreeze(presences)

    describe("when there is existing state", () => {
      const action = { type: "SET_PRESENCES", presences }

      it("adds presences in the action to state", () => {
        const newState = presencesReducer([], action)
        const tokens = newState.map(presences => presences.token)
        expect(tokens).to.deep.equal(["abc", "123"])
      })
    })

    describe("when the action is unhandled", () => {
      const action = { type: "IHAVENOIDEAWHATSHAPPENING" }

      it("returns the previous state", () => {
        expect(presencesReducer([{ given_name: "Morty" }], action)).to.deep.equal([{ given_name: "Morty" }])
      })
    })
  })

  describe("when action is SYNC_PRESENCE_DIFF", () => {
    describe("and the presence diff represents presences joining", () => {
      context("when the user is not already tracked in the presences list", () => {
        const presenceDiff = {
          joins: {
            ABC: { user: { name: "Kevin", online_at: 10, token: "ABC" } },
            XYZ: { user: { name: "Sarah", online_at: 20, token: "XYZ" } },
          },
          leaves: {},
        }

        deepFreeze(presenceDiff)

        const action = { type: "SYNC_PRESENCE_DIFF", presenceDiff }

        it("adds all of the presences to state", () => {
          const names = presencesReducer([], action).map(presences => presences.name)
          expect(names).to.eql(["Kevin", "Sarah"])
        })
      })

      context("and the presences is already tracked in the presences list", () => {
        const presenceDiff = {
          joins: {
            ABC: { user: { name: "Kevin", online_at: 10, token: "ABC" } },
          },
          leaves: {},
        }

        deepFreeze(presenceDiff)

        const action = { type: "SYNC_PRESENCE_DIFF", presenceDiff }

        it("does not add a duplicate to the presences list", () => {
          const presencessListAlreadyContainingUser = [{ token: "ABC", name: "Kevin", online_at: 10 }]
          const names = presencesReducer(
            presencessListAlreadyContainingUser,
            action
          ).map(presences => presences.name)
          expect(names).to.eql(["Kevin"])
        })
      })
    })

    describe("and the presence diff represents several presences on state leaving", () => {
      const presenceDiff = {
        joins: {},
        leaves: {
          someLeaverTokenOne: { user: { name: "Kevin", token: "someLeaverTokenOne" } },
          someLeaverTokenTwo: { user: { name: "Sarah", token: "someLeaverTokenTwo" } },
        },
      }

      const initialState = [{
        name: "Kevin",
        token: "someLeaverTokenOne",
      }, {
        name: "Sarah",
        token: "someLeaverTokenTwo",
      }, {
        name: "Travy",
        token: "TOTALLY_COOL_TOKEN!",
      }]

      deepFreeze(presenceDiff)
      deepFreeze(initialState)

      const action = { type: "SYNC_PRESENCE_DIFF", presenceDiff }

      it("removes all of the presences who have left", () => {
        const newState = presencesReducer(initialState, action)
        const tokens = newState.map(user => user.token)
        expect(tokens).to.eql(["TOTALLY_COOL_TOKEN!"])
      })
    })
  })

  describe("When action is UPDATE_PRESENCE", () => {
    const presenceToken = "abc123"
    const newAttributes = { age: 70 }
    const action = { type: "UPDATE_PRESENCE", presenceToken, newAttributes }
    const initialState = [{ token: "abc123", name: "Tiny Rick", age: 180 }, { token: "zzz444", name: "Morty", age: 15 }]
    deepFreeze(initialState)
    const newState = presencesReducer(initialState, action)

    it("should update user with matching token with new attributes", () => {
      expect(newState).to.deep.equal([{ token: "abc123", name: "Tiny Rick", age: 70 }, { token: "zzz444", name: "Morty", age: 15 }])
    })
  })
})

describe("selectors", () => {
  describe("findCurrentUser", () => {
    const state = {
      facilitatorId: 99,
      presences: [{
        id: 99,
        token: "123",
      }, {
        id: 101,
        token: "83jdkdkd83",
      }],
    }

    window.userToken = "123"

    it("finds the user whose token matches the window's `userToken`", () => {
      expect(selectors.findCurrentUser(state).token).to.deep.equal("123")
    })

    describe("when the facilitatorId on state matches the id of the current user", () => {
      it("labels that user as the facilitator", () => {
        expect(selectors.findCurrentUser(state)).to.deep.equal({
          id: 99,
          token: "123",
          is_facilitator: true,
        })
      })
    })

    describe("when the facilitatorId on state does *not* match the id of the current user", () => {
      it("explicitly labels that user a non-facilitator", () => {
        const state = {
          facilitatorId: 5,
          presences: [{
            id: 99,
            token: "123",
          }, {
            id: 101,
            token: "83jdkdkd83",
          }],
        }

        window.userToken = "123"

        expect(selectors.findCurrentUser(state)).to.deep.equal({
          id: 99,
          token: "123",
          is_facilitator: false,
        })
      })
    })
  })
})

describe("presence actions", () => {
  describe("setPresences", () => {
    const presences = [{ given_name: "Tiny Rick" }]

    it("should create an action to add presence to presences list", () => {
      expect(actionCreators.setPresences(presences)).to.deep.equal({ type: "SET_PRESENCES", presences })
    })
  })

  describe("updatePresence", () => {
    const presenceToken = "abcde12345"
    const newAttributes = { age: 170 }

    it("should create an action to update a given presence's attributes in presences", () => {
      expect(actionCreators.updatePresence(presenceToken, newAttributes)).to.deep.equal({ type: "UPDATE_PRESENCE", presenceToken, newAttributes })
    })
  })

  describe("syncPresenceDiff", () => {
    const presenceDiff = {
      joins: {
        someUserToken: { user: { name: "Timmy", age: 29 } },
      },
      leaves: {
        someOtherUserToken: { user: { name: "Travis", age: 30 } },
      },
    }

    it("returns a `SYNC_PRESENCE_DIFF` action", () => {
      expect(actionCreators.syncPresenceDiff(presenceDiff).type).to.equal("SYNC_PRESENCE_DIFF")
    })

    it("passes along the given presence diff", () => {
      const action = actionCreators.syncPresenceDiff(presenceDiff)
      expect(action.presenceDiff).to.deep.equal(presenceDiff)
    })
  })
})
