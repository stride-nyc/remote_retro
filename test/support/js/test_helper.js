import React from "react"
import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { createStore } from "redux"
import STAGES from "../../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

global.ASSET_DOMAIN = ""
global.Honeybadger = { notify: () => {}, setContext: () => {} }

// Create a mock store for testing
const createMockStore = (initialState = {}) => {
  return createStore(() => ({
    retro: {
      facilitator_id: 1,
      stage: IDEA_GENERATION,
    },
    ideas: [],
    votes: [],
    usersById: {},
    presences: [],
    ...initialState,
  }))
}

// Wrapper component to provide Redux store
export const renderWithRedux = (ui, initialState) => {
  const store = createMockStore(initialState)
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  )
}

/*
/  triggering responses to a given websocket "push" in tests is highly laborious,
/  as the push events aren't exposed outright, so here we setup a channel and
/  expose a helper for triggering push replies, leveraged like so:
/
/    const mockRetroChannel = setupMockRetroChannel()
/
/    // some code that triggers a push...
/
/    mockRetroChannel.__triggerReply("error", { some: "error body" })
*/

// eslint-disable-next-line import/prefer-default-export
export const setupMockRetroChannel = () => {
  /* eslint-disable global-require */
  const { Socket } = require("phoenix")
  /* eslint-enable global-require */

  const socket = new Socket("/socket", { timeout: 10000 })

  const originalMakeRef = socket.makeRef.bind(socket)

  // ensure we have access to the ref created for socket pushes,
  // so we can trigger replies for specific pushes in the __triggerReply helper
  let ref
  jest.spyOn(socket, "makeRef").mockImplementation(() => { ref = originalMakeRef(); return ref })
  jest.spyOn(socket, "isConnected").mockReturnValue(true)
  jest.spyOn(socket, "push").mockImplementation(() => {})

  const mockPhoenixChannel = socket.channel("topic", { one: "two" })
  mockPhoenixChannel.join().trigger("ok", {})

  // Create a mock RetroChannel that has the necessary methods
  const callbacks = {}

  const mockRetroChannel = {
    client: mockPhoenixChannel,
    push: jest.fn().mockImplementation(() => {
      return {
        receive: (status, callback) => {
          callbacks[status] = callback
          return this
        },
      }
    }),
    __triggerReply(status, response) {
      if (callbacks[status]) {
        callbacks[status](response)
      }
    },
  }

  return mockRetroChannel
}
