import React from "react"
import { render, fireEvent } from "@testing-library/react"
import EmailOptInToggle from "../../web/static/js/components/email_opt_in_toggle"

describe("EmailOptInToggle", () => {
  const defaultProps = {
    actions: {},
    currentUser: { id: 777, email_opt_in: false },
  }

  // Helper function to render the component with given props
  const renderComponent = (props = defaultProps) => {
    return render(<EmailOptInToggle {...props} />)
  }

  // Helper function to get the checkbox state
  const getCheckboxState = container => {
    return container.querySelector("input[type='checkbox']").checked
  }

  describe("when the current user previously opted out", () => {
    it("renders its checkbox input in the unchecked state", () => {
      const { container } = renderComponent()
      expect(getCheckboxState(container)).toBe(false)
    })
  })

  describe("when the user previously opted in", () => {
    it("renders its checkbox input in the checked state", () => {
      const { container } = renderComponent({
        ...defaultProps,
        currentUser: { email_opt_in: true },
      })
      expect(getCheckboxState(container)).toBe(true)
    })
  })

  describe("when the user clicks the toggle", () => {
    it("sends the updated preference to the server for persistence", () => {
      const updateUserAsync = jest.fn()
      const { container } = renderComponent({
        ...defaultProps,
        actions: { updateUserAsync },
      })

      // Find and click the button
      const button = container.querySelector("button")
      fireEvent.click(button)

      // Verify the action was called with the correct parameters
      expect(updateUserAsync).toHaveBeenCalledWith(777, { email_opt_in: true })
    })
  })
})
