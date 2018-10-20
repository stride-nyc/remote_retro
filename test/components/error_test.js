import React from "react"
import Modal from "react-modal"
import sinon from "sinon"
import { mount } from "enzyme"

import { Error } from "../../web/static/js/components/error"

describe("Error component", () => {
  let wrapper
  let portalToModalContent
  let modalBody

  const errorConfig = {
    message: "Something happening here.",
  }

  let actions = {}

  beforeEach(() => {
    wrapper = mount(<Error config={errorConfig} actions={actions} />)
    portalToModalContent = wrapper.find(Modal).instance().portal
    modalBody = portalToModalContent.content
  })

  it("renders the message text", () => {
    expect(modalBody.textContent).to.match(/something happening/i)
  })

  describe("clicking the close", () => {
    beforeEach(() => {
      actions = { clearError: sinon.spy() }

      wrapper = mount(<Error config={errorConfig} actions={actions} />)
      portalToModalContent = wrapper.find(Modal).instance().portal
      modalBody = portalToModalContent.content
      modalBody.querySelector(".close.icon").click()
    })

    it("invokes the clearError action", () => {
      expect(actions.clearError).called
    })
  })
})
