import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import HighContrastButton from "../../web/static/js/components/high_contrast_button"

describe("HighContrastButton", () => {
  const defaultProps = {
    actions: {},
    userOptions: { highContrastOn: false },
    className: "",
  }

  it("renders class names for outer div", () => {
    const { container } = render(
      <HighContrastButton {...defaultProps} className="sample-class" />
    )
    expect(container.firstChild).toHaveClass("sample-class")
  })

  describe("when in high contrast mode", () => {
    it("renders its checkbox input in the checked state", () => {
      render(
        <HighContrastButton {...defaultProps} userOptions={{ highContrastOn: true }} />
      )
      const checkbox = screen.getByRole("checkbox")
      expect(checkbox).toBeChecked()
    })
  })

  describe("when high contrast mode is off", () => {
    it("renders checkbox in unchecked state", () => {
      render(
        <HighContrastButton {...defaultProps} userOptions={{ highContrastOn: false }} />
      )
      const checkbox = screen.getByRole("checkbox")
      expect(checkbox).not.toBeChecked()
    })
  })

  describe("clicking high contrast button", () => {
    it("invokes the toggleHighContrastOn action", () => {
      const toggleHighContrastOn = jest.fn()
      const actions = { toggleHighContrastOn }

      render(
        <HighContrastButton {...defaultProps} actions={actions} />
      )
      const button = screen.getByRole("button")
      fireEvent.click(button)
      expect(toggleHighContrastOn).toHaveBeenCalled()
    })
  })
})
