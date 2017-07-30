import React from "react"
import Modal from "react-modal"
import { mount } from "enzyme"

import Alert from "../../web/static/js/components/alert"

describe("Alert component", () => {
  let wrapper
  let portalToModalContent
  let headerNode
  let modalBody

  let alertConfig = {
    headerText: "Some ole header text",
    bodyText: "Some completely different body text"
  }

  beforeEach(() => {
    wrapper = mount(<Alert config={alertConfig} />)
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
})
