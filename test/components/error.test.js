import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import Modal from "react-modal"
import { Error } from "../../web/static/js/components/error"

// Set up Modal for testing
Modal.setAppElement(document.createElement("div"))

describe("Error component", () => {
  const errorConfig = {
    message: "Something happening here.",
  }

  beforeEach(() => {
    // Create a div for the modal portal
    const modalRoot = document.createElement("div")
    modalRoot.setAttribute("id", "modal-root")
    document.body.appendChild(modalRoot)

    // Set the app element for react-modal
    Modal.setAppElement("#modal-root")
  })

  afterEach(() => {
    // Clean up
    const modalRoot = document.getElementById("modal-root")
    if (modalRoot) {
      document.body.removeChild(modalRoot)
    }
  })

  it("renders the message text", () => {
    render(<Error config={errorConfig} actions={{}} />)

    // The modal content should be in the document body
    expect(screen.getByText(/something happening/i)).toBeTruthy()
  })

  describe("clicking the close icon", () => {
    it("invokes the clearError action", () => {
      const clearError = jest.fn()
      const actions = { clearError }

      render(<Error config={errorConfig} actions={actions} />)

      // Find and click the close icon
      const closeIcon = document.querySelector(".close.icon")
      fireEvent.click(closeIcon)

      // Verify the action was called
      expect(clearError).toHaveBeenCalled()
    })
  })
})
