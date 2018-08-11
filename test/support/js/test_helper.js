import chai, { expect } from "chai"
import chaiUUID from "chai-uuid"
import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import sinon from "sinon"
import { Socket } from "phoenix"
import PropTypes from "prop-types"
import noop from "lodash/noop"
import STAGES from "../../../web/static/js/configs/stages"

chai.use(chaiUUID)

const { IDEA_GENERATION } = STAGES

Enzyme.configure({ adapter: new Adapter() })

global.hj = noop
global.expect = expect

global.requestAnimationFrame = callback => {
  setTimeout(callback, 0)
}

global.mountWithConnectedSubcomponents = (component, options) => {
  const store = {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({
      facilitatorId: 1,
      ideas: [],
      votes: [],
      stage: IDEA_GENERATION,
      usersById: {},
      presences: [],
      retro: {},
    }),
  }

  const defaultOptions = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  }

  return Enzyme.mount(component, { ...defaultOptions, ...options })
}

/*
/  triggering websocket "receive"s in tests is highly laborious, so we extract it out to a helper
/  that allows us to setup a mock channel, and trigger 'receive' messages on our pushes like so:
/    const mockRetroChannel = setupMockPhoenixChannel()
/    const push = mockRetroChannel.push("some_event", some_payload)
/    push.trigger("error", {})
*/

// eslint-disable-next-line import/prefer-default-export
export const setupMockPhoenixChannel = () => {
  const socket = new Socket("/socket", { timeout: 1 })

  sinon.stub(socket, "makeRef", () => 0)
  sinon.stub(socket, "isConnected", () => true)

  sinon.stub(socket, "push")

  const mockPhoenixChannel = socket.channel("topic", { one: "two" })
  mockPhoenixChannel.join().trigger("ok", {})

  return mockPhoenixChannel
}
