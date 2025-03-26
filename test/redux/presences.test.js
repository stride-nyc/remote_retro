import deepFreeze from "deep-freeze"
import {
  reducer as presencesReducer,
  actions as actionCreators,
} from "../../web/static/js/redux/presences"

describe("presences reducer", () => {
  describe("when there is an empty action", () => {
    describe("when no new state is passed", () => {
      it("should return the initial state of an empty array", () => {
        expect(presencesReducer(undefined, {})).toEqual([])
      })
    })
  })

  describe("when action is SET_PRESENCES", () => {
    const presences = [{
      token: "abc",
      online_at: 2,
      id: 3,
      nonSenseAttributeThatShouldNotAppear: "Herp",
    }, {
      token: "123",
      online_at: 1,
      id: 5,
      nonSenseAttributeThatShouldNotAppear: "McDerp",
    }]

    deepFreeze(presences)

    describe("when there is existing state", () => {
      const action = { type: "SET_PRESENCES", presences }

      it("adds presences in the action to state", () => {
        const newState = presencesReducer([], action)
        const tokens = newState.map(presence => presence.token)
        expect(tokens).toEqual(["abc", "123"])
      })

      it("maps the id attribute of the given presences to a user_id attribute", () => {
        const newState = presencesReducer([], action)
        const userIds = newState.map(presence => presence.user_id)
        expect(userIds).toEqual([3, 5])
      })

      // remainder of attributes are persisted on the user model
      // the attributes we keep are either a foreign key to the user_model
      // or ephemeral presence attributes
      it("excludes attributes other than user_id, token, online_at", () => {
        const newState = presencesReducer([], action)
        const examplePresence = newState[0]
        const presenceAttributesSorted = Object.keys(examplePresence).sort()

        expect(presenceAttributesSorted).toEqual([
          "online_at",
          "token",
          "user_id",
        ])
      })
    })

    describe("when the action is unhandled", () => {
      const action = { type: "IHAVENOIDEAWHATSHAPPENING" }

      it("returns the previous state", () => {
        expect(presencesReducer([{ given_name: "Morty" }], action)).toEqual([{ given_name: "Morty" }])
      })
    })
  })

  describe("when action is SYNC_PRESENCE_DIFF", () => {
    describe("and the presence diff represents presences joining", () => {
      describe("when the new presences is *not already tracked* in the presences list", () => {
        const presenceDiff = {
          joins: {
            ABC: { user: { id: 3, name: "Kevin", online_at: 10, token: "ABC" } },
            XYZ: { user: { id: 7, name: "Sarah", online_at: 20, token: "XYZ" } },
          },
          leaves: {},
        }

        deepFreeze(presenceDiff)

        const action = { type: "SYNC_PRESENCE_DIFF", presenceDiff }

        it("adds all of the presences to state", () => {
          const tokens = presencesReducer([], action).map(presence => presence.token)
          expect(tokens).toEqual(["ABC", "XYZ"])
        })

        it("maps the id attribute of the given presences to a user_id attribute", () => {
          const newState = presencesReducer([], action)
          const userIds = newState.map(presence => presence.user_id)
          expect(userIds).toEqual([3, 7])
        })

        it("excludes attributes other than user_id, token, online_at, and is_facilitator", () => {
          const newState = presencesReducer([], action)
          const examplePresence = newState[0]
          const presenceAttributesSorted = Object.keys(examplePresence).sort()

          expect(presenceAttributesSorted).toEqual([
            "online_at",
            "token",
            "user_id",
          ])
        })
      })

      describe("and the joining presences is *already tracked* in the presences list", () => {
        const presenceDiff = {
          joins: {
            ABC: { user: { id: 5, name: "Kevin", online_at: 10, token: "ABC" } },
          },
          leaves: {},
        }

        deepFreeze(presenceDiff)

        const action = { type: "SYNC_PRESENCE_DIFF", presenceDiff }

        it("does not add a duplicate to the presences list", () => {
          const presencesListAlreadyContainingUser = [{ token: "ABC", online_at: 10, user_id: 5 }]
          const updatedPresencesList = presencesReducer(
            presencesListAlreadyContainingUser,
            action
          )

          expect(updatedPresencesList).toEqual([{ token: "ABC", online_at: 10, user_id: 5 }])
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
        expect(tokens).toEqual(["TOTALLY_COOL_TOKEN!"])
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
      expect(newState).toEqual([{ token: "abc123", name: "Tiny Rick", age: 70 }, { token: "zzz444", name: "Morty", age: 15 }])
    })
  })
})

describe("presence actions", () => {
  describe("setPresences", () => {
    const presences = [{ given_name: "Tiny Rick" }]

    it("should create an action to add presence to presences list", () => {
      expect(actionCreators.setPresences(presences)).toEqual({ type: "SET_PRESENCES", presences })
    })
  })

  describe("updatePresence", () => {
    const presenceToken = "abcde12345"
    const newAttributes = { age: 170 }

    it("should create an action to update a given presence's attributes in presences", () => {
      expect(actionCreators.updatePresence(presenceToken, newAttributes)).toEqual({ type: "UPDATE_PRESENCE", presenceToken, newAttributes })
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
      expect(actionCreators.syncPresenceDiff(presenceDiff).type).toBe("SYNC_PRESENCE_DIFF")
    })

    it("passes along the given presence diff", () => {
      const action = actionCreators.syncPresenceDiff(presenceDiff)
      expect(action.presenceDiff).toEqual(presenceDiff)
    })
  })
})
