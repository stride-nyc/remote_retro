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
      earlierDate = new Date(clock.now - 4000)
    })

    it("the modal opens", () => {
      wrapper = mount(<ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />)

      const isOpen = wrapper.find("Modal").props().isOpen

      expect(isOpen).to.equal(true)
    })

    describe("when the modal is open", () => {
      let portalToModalContent
      
      beforeEach(() => {
        wrapper = mount(<ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />)
        portalToModalContent = wrapper.find(Modal).node.portal
      })

      describe("and the copy link button clicked", () => {
        beforeEach(() => {
          const content = portalToModalContent.refs.content
          const copyButton = content.querySelector(".copy.icon")
          copyButton.click()
        })

        it("copyLinkInput is in state", () => {
          expect(
            wrapper.state().hasOwnProperty('copyLinkInput')
          ).to.equal(true)
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

  describe("when the given retro was inserted into the db more than 5 seconds ago", () => {
    beforeEach(() => {
      earlierDate = new Date(clock.now - 6000)
    })

    it("the modal does not open", () => {
      wrapper = mount(<ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />)

      const isOpen = wrapper.find("Modal").props().isOpen

      expect(isOpen).to.equal(false)
    })
  })
})

