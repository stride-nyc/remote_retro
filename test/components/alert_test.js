import React from "react"
import Modal from "react-modal"
import sinon from "sinon"

import { Alert } from "../../web/static/js/components/alert"

describe("Alert component", () => {
  let wrapper
  let portalToModalContent
  let modalBody

  const alertConfig = {
    headerText: "Some ole header text",
    BodyComponent: () => <p>"Some completely different body text"</p>,
  }

  const alternateAlertConfig = {
    headerText: "Fart time!",
    BodyComponent: () => <p>Who did it?</p>,
  }

  let actions = {}

  describe("initial render", () => {
    describe("when passed a config", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(<Alert config={alertConfig} actions={actions} />)
        portalToModalContent = wrapper.find(Modal).instance().portal
        modalBody = portalToModalContent.content
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

          wrapper = mountWithConnectedSubcomponents(<Alert config={alertConfig} actions={actions} />)
          portalToModalContent = wrapper.find(Modal).instance().portal
          modalBody = portalToModalContent.content
          modalBody.querySelector("button").click()
        })

        it("invokes the clearAlert action", () => {
          expect(actions.clearAlert).called
        })
      })

      describe("when the alert is dismissed from upstream", () => {
        beforeEach(() => {
          wrapper.setProps({ config: null })
        })

        it("lets react modal know that the exit animation can begin", () => {
          const reactModalInstance = wrapper.find(Modal)
          expect(reactModalInstance.props().isOpen).to.eql(false)
        })

        describe("when a *new* alert is then passed from upstream", () => {
          beforeEach(() => {
            wrapper.setProps({ config: alternateAlertConfig })
          })

          it("lets react modal know that the entrance animation can begin", () => {
            const reactModalInstance = wrapper.find(Modal)
            expect(reactModalInstance.props().isOpen).to.eql(true)
          })

          it("displays the new text in the modal body", () => {
            portalToModalContent = wrapper.find(Modal).instance().portal
            modalBody = portalToModalContent.content
            expect(modalBody.querySelector(".header").textContent).to.match(/fart time!/i)
          })
        })
      })
    })

    describe("when the config is non-existent", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(<Alert config={null} actions={actions} />)
      })

      it("renders nothing at all", () => {
        expect(wrapper.html()).to.equal(null)
      })
    })
  })
})
