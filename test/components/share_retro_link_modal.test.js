import React from "react"
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Modal from "react-modal"
import { renderWithRedux } from "../support/js/jest_test_helper"

import { ShareRetroLinkModal } from "../../web/static/js/components/share_retro_link_modal"

// Set up Modal for testing
Modal.setAppElement(document.createElement("div"))

describe("ShareRetroLinkModal component", () => {
  let mockDate
  let earlierDate

  beforeEach(() => {
    // Use Jest's fake timers
    jest.useFakeTimers()
    mockDate = new Date(2017, 1, 1, 0, 0, 0)
    jest.setSystemTime(mockDate)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("when the given retro was inserted into the db less than 5 seconds ago", () => {
    beforeEach(() => {
      earlierDate = new Date(mockDate.getTime() - 5500)
    })

    it("the modal opens", () => {
      renderWithRedux(
        <ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />
      )

      // In React Testing Library, we check for rendered content rather than props
      expect(screen.getByText("Share the retro link below with teammates!")).toBeInTheDocument()
    })

    describe("when the modal is open", () => {
      beforeEach(() => {
        document.execCommand = jest.fn()
        renderWithRedux(
          <ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />
        )
      })

      describe("and the copy link button is clicked", () => {
        let readonlyUrlInput

        beforeEach(() => {
          readonlyUrlInput = screen.getByRole("textbox")
          readonlyUrlInput.select = jest.fn()

          // Find the copy button and click it
          const copyButton = screen.getByRole("button", { name: /copy link to clipboard/i })
          fireEvent.click(copyButton)
        })

        it("selects the text in the input, copying it to the clipboard", () => {
          expect(readonlyUrlInput.select).toHaveBeenCalled()
          expect(document.execCommand).toHaveBeenCalledWith("copy")
        })
      })

      describe("and the close icon is clicked", () => {
        beforeEach(() => {
          // Find the close button and click it
          const closeButton = screen.getByRole("button", { name: "" })
          fireEvent.click(closeButton)
        })

        it("closes the modal", () => {
          // After closing, the modal content should no longer be in the document
          expect(
            screen.queryByText("Share the retro link below with teammates!")
          ).not.toBeInTheDocument()
        })
      })
    })
  })

  describe("when the given retro was inserted into the db more than 7.5 seconds ago", () => {
    beforeEach(() => {
      earlierDate = new Date(mockDate.getTime() - 7600)
    })

    it("the modal does not open", () => {
      renderWithRedux(
        <ShareRetroLinkModal retroCreationTimestamp={earlierDate.toUTCString()} />
      )

      // Modal content should not be in the document
      expect(
        screen.queryByText("Share the retro link below with teammates!")
      ).not.toBeInTheDocument()
    })
  })
})
