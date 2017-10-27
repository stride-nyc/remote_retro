import { expect } from "chai"
import { mount } from "enzyme"
import PropTypes from "prop-types"
import noop from "lodash/noop"

global.hj = noop
global.expect = expect

global.mountWithConnectedSubcomponents = (component, options) => {
  const store = {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ }),
  }

  const defaultOptions = {
    context: { store },
    childContextTypes: { store: PropTypes.object.isRequired },
  }

  return mount(component, { ...defaultOptions, ...options })
}
