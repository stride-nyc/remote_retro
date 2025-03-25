import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"

import SelectDropdown from "../../web/static/js/components/select_dropdown"

describe("SelectDropdown component", () => {
  const defaultProps = {
    labelName: "label",
    value: "value",
    onChange: jest.fn(),
    selectOptions: [],
    isRequired: false,
  }

  describe("when pointerText is not provided as a prop", () => {
    it("does not render the pointing label", () => {
      render(<SelectDropdown {...defaultProps} />)
      // In React Testing Library, we would check for absence of elements differently
      // Since we don't have a specific class or text to query for the pointing label,
      // we can check that no element with class "pointing" exists
      const pointingElements = document.querySelectorAll(".pointing")
      expect(pointingElements.length).toBe(0)
    })
  })
})
