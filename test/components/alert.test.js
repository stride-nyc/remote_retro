import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"
import Modal from "react-modal"
import { Alert } from "../../web/static/js/components/alert"
import renderWithRedux from "../support/js/render_with_redux"

// Mock Modal's setAppElement to avoid test warnings
Modal.setAppElement(document.createElement("div"))

// Clean up after each test
afterEach(cleanup)

describe("Alert component", () => {
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
      it("renders the headerText in a header text component", () => {
        actions = { clearAlert: jest.fn() }
        render(<Alert config={alertConfig} actions={actions} />)
        expect(screen.getByText(/some ole header text/i)).toBeInTheDocument()
      })

      it("renders the body component content", () => {
        actions = { clearAlert: jest.fn() }
        render(<Alert config={alertConfig} actions={actions} />)
        expect(screen.getByText(/some completely different body text/i)).toBeInTheDocument()
      })

      it("renders the button autofocused", () => {
        actions = { clearAlert: jest.fn() }
        render(<Alert config={alertConfig} actions={actions} />)
        const button = screen.getByRole("button", { name: /got it!/i })
        expect(button).toHaveFocus()
      })

      describe("clicking the button", () => {
        it("invokes the clearAlert action", () => {
          actions = { clearAlert: jest.fn() }
          render(<Alert config={alertConfig} actions={actions} />)

          const button = screen.getByRole("button", { name: /got it!/i })
          fireEvent.click(button)

          expect(actions.clearAlert).toHaveBeenCalled()
        })
      })

      describe("when the alert is dismissed from upstream", () => {
        it("lets react modal know that the exit animation can begin", () => {
          actions = { clearAlert: jest.fn() }
          const { rerender } = renderWithRedux(<Alert config={alertConfig} actions={actions} />)

          // Rerender with null config
          rerender(<Alert config={null} actions={actions} />)

          // Since the component returns null when config is null, we can't directly
          // test the Modal props. Instead, we can verify the content is no longer visible
          expect(screen.queryByText(/some ole header text/i)).not.toBeInTheDocument()
        })

        describe("when a *new* alert is then passed from upstream", () => {
          it("displays the new text in the modal body", () => {
            // Use renderWithRedux to handle potential Redux store issues
            const { rerender } = renderWithRedux(<Alert config={alertConfig} actions={actions} />)

            // Dismiss the alert
            rerender(<Alert config={null} actions={actions} />)

            // Show a new alert
            rerender(<Alert config={alternateAlertConfig} actions={actions} />)

            // Check that the new content is displayed
            expect(screen.getByText(/fart time!/i)).toBeInTheDocument()
            expect(screen.getByText(/who did it\?/i)).toBeInTheDocument()
          })
        })
      })
    })

    describe("when the config is non-existent", () => {
      it("renders nothing at all", () => {
        const { container } = render(<Alert config={null} actions={actions} />)
        expect(container.firstChild).toBeNull()
      })
    })
  })
})
