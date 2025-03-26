import deepFreeze from "deep-freeze"

import { setupMockRetroChannel } from "../support/js/test_helper"

import {
  reducer,
  actions as actionCreators,
  selectors,
} from "../../web/static/js/redux/retro"

import STAGES from "../../web/static/js/configs/stages"

const { PRIME_DIRECTIVE } = STAGES

describe("retro reducer", () => {
  describe("unhandled actions", () => {
    describe("when there is an empty action", () => {
      describe("when no initial state is passed", () => {
        it("should return an initial state of null", () => {
          expect(reducer(undefined, { type: "unknown" })).toEqual(null)
        })
      })

      describe("when an initial state is passed", () => {
        const initialState = deepFreeze({
          stage: "derp",
          inserted_at: "2017-04-14T17:30:10",
        })

        it("should return that initial state", () => {
          expect(reducer(initialState, {})).toEqual(initialState)
        })
      })
    })
  })

  describe("handled actions", () => {
    describe("when invoked with a SET_INITIAL_STATE action", () => {
      it("returns an object based on the initialState, but stripped of attributes containing arrays", () => {
        const actionInitialState = {
          inserted_at: "holy mother of jeebus",
          stage: "prime-directive",
          facilitator_id: 98,
          ideas: [],
          votes: [],
        }
        const action = { type: "SET_INITIAL_STATE", initialState: actionInitialState }
        expect(reducer(undefined, action)).toEqual({
          inserted_at: "holy mother of jeebus",
          stage: "prime-directive",
          facilitator_id: 98,
        })
      })
    })

    describe("when a retro stage progression happens or the facilitator changes", () => {
      const updateCommittedActions = ["RETRO_STAGE_PROGRESSION_COMMITTED", "RETRO_FACILITATOR_CHANGE_COMMITTED"]

      updateCommittedActions.forEach(actionType => {
        it("returns the transformed state augmented with updated attributes", () => {
          const initialState = deepFreeze({
            stage: "lobby",
            facilitator_id: 67,
          })

          const payload = {
            retro: {
              stage: "new stage",
              facilitator_id: 70,
              someNewKey: "someNewVal",
            },
          }
          const action = { type: actionType, payload }
          expect(reducer(initialState, action)).toMatchObject({
            stage: "new stage",
            facilitator_id: 70,
            someNewKey: "someNewVal",
          })
        })

        it("sets the updateRequested key to false", () => {
          const initialState = deepFreeze({
            updateRequested: true,
          })

          const action = { type: actionType, payload: { retro: {} } }
          expect(reducer(initialState, action)).toEqual({
            updateRequested: false,
          })
        })
      })
    })

    describe("when invoked with the RETRO_UPDATE_REJECTED action", () => {
      it("sets `updateRequested` to false", () => {
        const initialState = deepFreeze({ one: "two", updateRequested: true })
        const action = { type: "RETRO_UPDATE_REJECTED" }

        expect(reducer(initialState, action)).toEqual({
          one: "two",
          updateRequested: false,
        })
      })
    })

    describe("when invoked with an RETRO_UPDATE_REQUESTED action", () => {
      it("transforms the state to reflect the in-progress request", () => {
        const initialState = deepFreeze({
          stage: "lobby",
          facilitator_id: 67,
        })

        const action = { type: "RETRO_UPDATE_REQUESTED" }
        expect(reducer(initialState, action)).toEqual({
          ...initialState,
          updateRequested: true,
        })
      })
    })
  })
})

describe("action creators", () => {
  describe("retroUpdateCommitted", () => {
    it("returns a thunk", () => {
      const thunk = actionCreators.retroUpdateCommitted({ stage: "newSlang" })
      expect(typeof thunk).toBe("function")
    })

    describe("when the given payload contains a stage different than the current stage", () => {
      it("alerts the store that the stage has changed, passing full payload", () => {
        const getState = () => ({
          retro: { stage: "living", facilitator_id: 53 },
          usersById: {
            53: {
              id: 53,
            },
          },
          presences: [{
            user_id: 53,
            token: "zyb",
          }],
        })

        const payload = {
          retro: { stage: "afterlife" },
          anyOtherKey: { arbitrary: "values" },
        }

        const thunk = actionCreators.retroUpdateCommitted(payload)
        const dispatchSpy = jest.fn()

        thunk(dispatchSpy, getState, {})

        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
          type: "RETRO_STAGE_PROGRESSION_COMMITTED",
          payload,
        }))
      })
    })

    describe("when the given payload contains a facilitator id different than the current facilitator", () => {
      beforeEach(() => {
        window.userToken = "currentUserToken"
      })

      it("alerts the store that the facilitator has changed, passing full payload", () => {
        const getState = () => ({
          retro: { facilitator_id: 51 },
          usersById: {
            53: {
              id: 53,
            },
          },
          presences: [{
            user_id: 53,
            token: "currentUserToken",
          }],
        })

        const payload = {
          retro: { facilitator_id: 53 },
          anyOtherKey: {},
        }

        const thunk = actionCreators.retroUpdateCommitted(payload)
        const dispatchSpy = jest.fn()

        thunk(dispatchSpy, getState, {})

        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
          type: "RETRO_FACILITATOR_CHANGE_COMMITTED",
          payload,
        }))
      })

      describe("when the new facilitator id is the current user's id", () => {
        beforeEach(() => {
          window.userToken = "currentUserToken"
        })

        it("alerts the current user that they've become the facilitator", () => {
          const getState = () => ({
            retro: { facilitator_id: 51 },
            usersById: {
              53: { id: 53 },
              51: { id: 51 },
            },
            presences: [{
              user_id: 53,
              token: "currentUserToken",
            }, {
              user_id: 51,
              token: "someNoneCurrentUserToken",
            }],
          })

          const payload = {
            retro: { facilitator_id: 53 },
          }

          const thunk = actionCreators.retroUpdateCommitted(payload)
          const dispatchSpy = jest.fn()

          thunk(dispatchSpy, getState, {})

          expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: "CURRENT_USER_HAS_BECOME_FACILITATOR",
          }))
        })

        afterEach(() => {
          window.userToken = null
        })
      })

      describe("when the new facilitator id is *not* the current user's id", () => {
        beforeEach(() => {
          window.userToken = "tokenForCurrentUser!"
        })

        it("does not alert the user that they've been made facilitator", () => {
          const getState = () => ({
            retro: { facilitator_id: 51 },
            usersById: {
              53: { id: 53 },
              51: { id: 51 },
            },
            presences: [{
              user_id: 53,
              token: "tokenForSomeoneWhoIsntTheCurrentUser!",
            }, {
              user_id: 51,
              token: "tokenForCurrentUser!",
            }],
          })

          const payload = {
            retro: { facilitator_id: 53 },
          }

          const thunk = actionCreators.retroUpdateCommitted(payload)
          const dispatchSpy = jest.fn()

          thunk(dispatchSpy, getState, {})

          expect(dispatchSpy).not.toHaveBeenCalledWith(expect.objectContaining({
            type: "CURRENT_USER_HAS_BECOME_FACILITATOR",
          }))
        })

        afterEach(() => {
          window.userToken = null
        })
      })
    })
  })

  describe("updateRetroAsync", () => {
    it("returns a thunk", () => {
      const thunk = actionCreators.updateRetroAsync({ stage: "newSlang" })
      expect(typeof thunk).toBe("function")
    })

    describe("invoking the returned function", () => {
      let thunk
      let mockRetroChannel

      beforeEach(() => {
        thunk = actionCreators.updateRetroAsync({ stage: "newSlang" })
        mockRetroChannel = setupMockRetroChannel()
        jest.spyOn(mockRetroChannel, "push")
      })

      afterEach(() => {
        jest.restoreAllMocks()
      })

      it("results in a push to the retroChannel", () => {
        thunk(() => {}, undefined, mockRetroChannel)
        expect(mockRetroChannel.push).toHaveBeenCalledWith("retro_edited", { stage: "newSlang" })
      })

      it("notifies the store that a retro update request is in flight", () => {
        const dispatchSpy = jest.fn()

        thunk(dispatchSpy, undefined, mockRetroChannel)
        expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "RETRO_UPDATE_REQUESTED" }))
      })

      describe("when the push results in an error", () => {
        it("dispatches an error", () => {
          const dispatchSpy = jest.fn()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          mockRetroChannel.__triggerReply("error", {})

          expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "RETRO_UPDATE_REJECTED" }))
        })
      })
    })
  })

  describe("setInitialState", () => {
    it("creates an action to set the retro's initial state", () => {
      const initialState = { stage: PRIME_DIRECTIVE, inserted_at: "2017-04-14T17:30:10" }

      expect(actionCreators.setInitialState(initialState)).toEqual({
        type: "SET_INITIAL_STATE",
        initialState,
      })
    })
  })
})

describe("selectors", () => {
  describe("isAnActionItemsStage", () => {
    it("returns true for the 'action-items' stage", () => {
      expect(
        selectors.isAnActionItemsStage({ retro: { stage: "action-items" } })
      ).toEqual(true)
    })

    it("returns true for the 'groups-action-items' stage", () => {
      expect(
        selectors.isAnActionItemsStage({ retro: { stage: "groups-action-items" } })
      ).toEqual(true)
    })

    it("returns false for non-action item stages", () => {
      expect(
        selectors.isAnActionItemsStage({ retro: { stage: "idea-generation" } })
      ).toEqual(false)
    })
  })

  describe("isRetroClosed", () => {
    it("returns true for the 'closed' stage", () => {
      expect(
        selectors.isRetroClosed({ retro: { stage: "closed" } })
      ).toEqual(true)
    })

    it("returns true for the 'groups-closed' stage", () => {
      expect(
        selectors.isRetroClosed({ retro: { stage: "groups-closed" } })
      ).toEqual(true)
    })

    it("returns false for non-closed stages", () => {
      expect(
        selectors.isRetroClosed({ retro: { stage: "idea-generation" } })
      ).toEqual(false)
    })
  })
})
