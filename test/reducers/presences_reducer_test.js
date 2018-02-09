import deepFreeze from "deep-freeze"
import presencesReducer, { findFacilitatorName, findCurrentUser } from "../../web/static/js/reducers/presences"

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

      it("adds presences in the action to state, assigning facilitatorship to earliest arrival", () => {
        const newState = presencesReducer([], action)
        const tokens = newState.map(presences => presences.token)
        expect(tokens).to.deep.equal(["abc", "123"])
      })

      it("assigns the facilitator role only to the presences who's been online longest", () => {
        expect(presencesReducer([], action)).to.deep.equal([{
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

      it("removes all of the presences who have left", () => {
        const newState = presencesReducer(initialState, action)
        const tokens = newState.map(user => user.token)
        expect(tokens).to.eql(["TOTALLY_COOL_TOKEN!"])
      })

      it("ensures the facilitatorship is transferred to the longest tenured", () => {
        const newState = presencesReducer(initialState, action)
        expect(newState[0].is_facilitator).to.equal(true)
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
    const stubUser = { token: "123" }
    const stubPresences = [stubUser]
    window.userToken = "123"

    it("finds the user with the given token", () => {
      expect(findCurrentUser(stubPresences)).to.deep.equal(stubUser)
    })
  })

  describe("findFacilitatorName", () => {
    const stubFacilitator = {
      is_facilitator: true,
      name: "Jill",
    }
    const stubPresences = [stubFacilitator, { is_facilitator: false, name: "Bob" }]

    it("finds the facilitator's name", () => {
      expect(findFacilitatorName(stubPresences)).to.equal(stubFacilitator.name)
    })
  })
})
