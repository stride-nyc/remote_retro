import chai, { expect } from "chai"
import chaiUUID from "chai-uuid"
import sinonChai from "sinon-chai"

import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import sinon from "sinon"
import PropTypes from "prop-types"
import noop from "lodash/noop"
import STAGES from "../../../web/static/js/configs/stages"

chai.use(chaiUUID)
chai.use(sinonChai)

const { IDEA_GENERATION } = STAGES

Enzyme.configure({ adapter: new Adapter() })

global.hj = noop
global.expect = expect
global.Image = function Image() {}

global.requestAnimationFrame = callback => {
  setTimeout(callback, 0)
}

const store = {
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({
    retro: {
      facilitator_id: 1,
      stage: IDEA_GENERATION,
    },
    ideas: [],
    votes: [],
    usersById: {},
    presences: [],
    mobile: {
      selectedCategoryTab: "happy",
    },
    stageConfig: {},
    ideaGenerationCategories: [],
    browser: {
      greaterThan: {
        small: true,
        medium: true,
        large: true,
      },
    },
  }),
}

const defaultOptions = {
  context: { store },
  childContextTypes: { store: PropTypes.object.isRequired },
}

global.mountWithConnectedSubcomponents = (component, options) => {
  return Enzyme.mount(component, { ...defaultOptions, ...options })
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

const STUBBED_REF = 0
const STUBBED_CHANNEL_REPLY_REF = `chan_reply_${STUBBED_REF}`

// eslint-disable-next-line import/prefer-default-export
export const setupMockRetroChannel = () => {
  /* eslint-disable global-require */
  const { Socket } = require("phoenix")
  const RetroChannel = require("../../../web/static/js/services/retro_channel").default
  /* eslint-enable global-require */

  // Build out a fake that mostly inherits from the real RetroChannel, but overrides
  // the constructor to avoid problematic WebSocket code from executing.
  // In this constructor override, we uphold the contract of setting a channel client, but
  // we assign a fake so that we can trigger messages on the client in our tests
  class MockRetroChannel {
    constructor(mockClient) {
      this.client = mockClient
    }
  }
  // https://stackoverflow.com/questions/44288164/cannot-assign-to-read-only-property-name-of-object-object-object#answer-44288358
  MockRetroChannel.prototype = Object.create(RetroChannel.prototype)
  MockRetroChannel.prototype.constructor = MockRetroChannel

  const socket = new Socket("/socket", { timeout: 1 })
  sinon.stub(socket, "makeRef", () => STUBBED_REF)
  sinon.stub(socket, "isConnected", () => true)
  sinon.stub(socket, "push")

  const mockPhoenixChannel = socket.channel("topic", { one: "two" })
  mockPhoenixChannel.join().trigger("ok", {})

  const retroChannel = new MockRetroChannel(mockPhoenixChannel)

  retroChannel.__triggerReply = (status, response) => {
    retroChannel.client.trigger(STUBBED_CHANNEL_REPLY_REF, { status, response })
  }

  return retroChannel
}
