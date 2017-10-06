import React from "react"
import Modal from "react-modal"
import { mount } from "enzyme"
import sinon from "sinon"

import ShareRetroLinkModal from "../../web/static/js/components/share_retro_link_modal"

describe("ShareRetroLinkModal component", () => {
  let wrapper
  let clock
  let earlierDate

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date(2017, 1, 1, 0, 0, 0).getTime())
  })

  afterEach(() => {
    clock.restore()
  })

  describe("when the given retro was inserted into the db less than 5 seconds ago", () => {
    beforeEach(() => {
      earlierDate = new Date(clock.now - 5500)
    })

    it("the modal opens", () => {
      wrapper = mount(<ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />)

      const isOpen = wrapper.find("Modal").props().isOpen

      expect(isOpen).to.equal(true)
    })

    describe("when the modal is open", () => {
      let portalToModalContent

      beforeEach(() => {
        document.execCommand = sinon.spy()
        wrapper = mount(<ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />)
        portalToModalContent = wrapper.find(Modal).node.portal
      })

      describe("and the copy link button is clicked", () => {
        let readonlyUrlInput

        beforeEach(() => {
          const portalContent = portalToModalContent.refs.content
          const copyButton = portalContent.querySelector(".copy.icon")
          readonlyUrlInput = portalContent.querySelector("input[type='text']")
          readonlyUrlInput.select = sinon.spy()

          copyButton.click()
        })

        it("selects the text in the input, copying it to the clipboard", () => {
          expect(() => {
            sinon.assert.callOrder(readonlyUrlInput.select, document.execCommand)
          }).to.not.throw()

          expect(document.execCommand.calledWithExactly("copy")).to.equal(true)
        })
      })

      describe("and the overlay outside the modal is clicked", () => {
        beforeEach(() => {
          const overlay = portalToModalContent.refs.overlay
          overlay.click()
        })

        it("closes the modal", () => {
          const isOpen = wrapper.find("Modal").props().isOpen
          expect(isOpen).to.equal(false)
        })
      })

      describe("and the close icon is clicked", () => {
        beforeEach(() => {
          const content = portalToModalContent.refs.content
          const closeIcon = content.querySelector(".close.icon")
          closeIcon.click()
        })

        it("closes the modal", () => {
          const isOpen = wrapper.find("Modal").props().isOpen
          expect(isOpen).to.equal(false)
        })
      })
    })
  })

  describe("when the given retro was inserted into the db more than 7.5 seconds ago", () => {
    beforeEach(() => {
      earlierDate = new Date(clock.now - 7600)
    })

    it("the modal does not open", () => {
      wrapper = mount(<ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />)

      const isOpen = wrapper.find("Modal").props().isOpen

      expect(isOpen).to.equal(false)
    })
  })
})

