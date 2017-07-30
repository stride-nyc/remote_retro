import React from "react"
import Modal from "react-modal"
import { mount } from "enzyme"
import sinon from "sinon"

import { Alert } from "../../web/static/js/components/alert"

describe("Alert component", () => {
  let wrapper
  let portalToModalContent
  let modalBody

  const alertConfig = {
    headerText: "Some ole header text",
    bodyText: "Some completely different body text",
  }

  let actions = {}

  beforeEach(() => {
    wrapper = mount(<Alert config={alertConfig} actions={actions} />)
    portalToModalContent = wrapper.find(Modal).node.portal
    modalBody = portalToModalContent.refs.content
  })

  it("renders the headerText in a header text component", () => {
    expect(modalBody.querySelector(".header").textContent).to.match(/some ole header text/i)
  })

  it("renders the headerText in a header text component", () => {
    expect(
      modalBody.querySelector(".content").textContent
    ).to.match(/some completely different body text/i)
  })

  it("renders the button autofocused", () => {
    const button = modalBody.querySelector("button")
    expect(button).to.deep.equal(document.activeElement)
  })

  describe("clicking the button", () => {
    beforeEach(() => {
      actions = { clearAlert: sinon.spy() }

      wrapper = mount(<Alert config={alertConfig} actions={actions} />)
      portalToModalContent = wrapper.find(Modal).node.portal
      modalBody = portalToModalContent.refs.content
      modalBody.querySelector("button").click()
    })

    it("invokes the clearAlert action", () => {
      expect(actions.clearAlert.called).to.eql(true)
    })
  })
})
