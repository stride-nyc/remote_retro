import deepFreeze from "deep-freeze"
import sinon from "sinon"

import { setupMockPhoenixChannel } from "../support/js/test_helper"

import {
  reducer,
  actions as actionCreators,
} from "../../web/static/js/redux/retro"

import stageConfigs from "../../web/static/js/configs/stage_configs"
import STAGES from "../../web/static/js/configs/stages"

const { PRIME_DIRECTIVE } = STAGES

describe("retro reducer", () => {
  describe("unhandled actions", () => {
    describe("when there is an empty action", () => {
      describe("when no initial state is passed", () => {
        it("should return an initial state of null", () => {
          expect(reducer(undefined, { type: "unknown" })).to.equal(null)
        })
      })

      describe("when an initial state is passed", () => {
        const initialState = deepFreeze({
          stage: "derp",
          inserted_at: "2017-04-14T17:30:10",
        })

        it("should return that initial state", () => {
          expect(reducer(initialState, {})).to.equal(initialState)
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
        expect(reducer(undefined, action)).to.eql({
          inserted_at: "holy mother of jeebus",
          stage: "prime-directive",
          facilitator_id: 98,
        })
      })
    })

    describe("when invoked with an RETRO_UPDATE_COMMITTED action", () => {
      it("returns the transformed state augmented with updated attributes", () => {
        const initialState = deepFreeze({
          stage: "lobby",
          facilitator_id: 67,
        })

        const retroChanges = {
          stage: "new stage",
          facilitator_id: 70,
          someNewKey: "someNewVal",
        }
        const action = { type: "RETRO_UPDATE_COMMITTED", retroChanges }
        expect(reducer(initialState, action)).to.include({
          stage: "new stage",
          facilitator_id: 70,
          someNewKey: "someNewVal",
        })
      })

      it("sets the updateRequested key to false", () => {
        const initialState = deepFreeze({
          updateRequested: true,
        })

        const action = { type: "RETRO_UPDATE_COMMITTED", retro: {} }
        expect(reducer(initialState, action)).to.eql({
          updateRequested: false,
        })
      })
    })

    describe("when invoked with the RETRO_UPDATE_REJECTED action", () => {
      it("sets `updateRequested` to false", () => {
        const initialState = deepFreeze({ one: "two", updateRequested: true })
        const action = { type: "RETRO_UPDATE_REJECTED" }

        expect(reducer(initialState, action)).to.eql({
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
        expect(reducer(initialState, action)).to.eql({
          ...initialState,
          updateRequested: true,
        })
      })
    })
  })
})

describe("action creators", () => {
  describe("updateRetroSync", () => {
    it("creates an action to update the retro", () => {
      expect(actionCreators.updateRetroSync({ stage: "newSlang" })).to.deep.equal({
        type: "RETRO_UPDATE_COMMITTED",
        retroChanges: {
          stage: "newSlang",
        },
        stageConfigs,
      })
    })
  })

  describe("updateRetroAsync", () => {
    it("returns a thunk", () => {
      const thunk = actionCreators.updateRetroAsync({ stage: "newSlang" })
      expect(typeof thunk).to.equal("function")
    })

    describe("invoking the returned function", () => {
      let thunk
      let mockRetroChannel

      beforeEach(() => {
        thunk = actionCreators.updateRetroAsync({ stage: "newSlang" })
        mockRetroChannel = setupMockPhoenixChannel()
        sinon.spy(mockRetroChannel, "push")
      })

      afterEach(() => {
        mockRetroChannel.push.restore()
      })

      it("results in a push to the retroChannel", () => {
        thunk(() => {}, undefined, mockRetroChannel)
        expect(mockRetroChannel.push).calledWith("retro_edited", { stage: "newSlang" })
      })

      it("notifies the store that a retro update request is in flight", () => {
        const dispatchSpy = sinon.spy()

        thunk(dispatchSpy, undefined, mockRetroChannel)
        expect(dispatchSpy).calledWithMatch({ type: "RETRO_UPDATE_REQUESTED" })
      })

      describe("when the push results in an error", () => {
        it("dispatches an error", () => {
          const dispatchSpy = sinon.spy()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          mockRetroChannel.__triggerReply("error", {})

          expect(dispatchSpy).calledWithMatch({ type: "RETRO_UPDATE_REJECTED" })
        })
      })
    })
  })

  describe("setInitialState", () => {
    it("creates an action to set the retro's initial state", () => {
      const initialState = { stage: PRIME_DIRECTIVE, inserted_at: "2017-04-14T17:30:10" }

      expect(actionCreators.setInitialState(initialState)).to.deep.equal({
        type: "SET_INITIAL_STATE",
        initialState,
      })
    })
  })
})
