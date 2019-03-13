import chai, { expect } from "chai"
import chaiUUID from "chai-uuid"
import sinonChai from "sinon-chai"

import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import sinon from "sinon"
import { Socket } from "phoenix"
import PropTypes from "prop-types"
import noop from "lodash/noop"
import STAGES from "../../../web/static/js/configs/stages"

chai.use(chaiUUID)
chai.use(sinonChai)

const { IDEA_GENERATION } = STAGES

Enzyme.configure({ adapter: new Adapter() })

global.hj = noop
global.expect = expect

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
/    const mockRetroChannel = setupMockPhoenixChannel()
/
/    // some code that triggers a push...
/
/    mockRetroChannel.__triggerReply("error", { some: "error body" })
*/

const STUBBED_REF = 0
const STUBBED_CHANNEL_REPLY_REF = `chan_reply_${STUBBED_REF}`

// eslint-disable-next-line import/prefer-default-export
export const setupMockPhoenixChannel = () => {
  const socket = new Socket("/socket", { timeout: 1 })

  sinon.stub(socket, "makeRef", () => STUBBED_REF)
  sinon.stub(socket, "isConnected", () => true)

  sinon.stub(socket, "push")

  const mockPhoenixChannel = socket.channel("topic", { one: "two" })
  mockPhoenixChannel.join().trigger("ok", {})

  mockPhoenixChannel.__triggerReply = (status, response) => {
    mockPhoenixChannel.trigger(STUBBED_CHANNEL_REPLY_REF, { status, response })
  }

  return mockPhoenixChannel
}
