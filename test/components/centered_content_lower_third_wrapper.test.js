import React from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithRedux } from "../support/js/test_helper"

import CenteredContentLowerThirdWrapper from "../../web/static/js/components/centered_content_lower_third_wrapper"

describe("CenteredContentLowerThirdWrapper", () => {
  const defaultProps = {
    currentUser: {},
    actions: {},
    stageConfig: { progressionButton: {} },
    userOptions: { highContrastOn: false },
  }

  it("renders the children passed", () => {
    renderWithRedux(
      <CenteredContentLowerThirdWrapper {...defaultProps}>
        <p>Hey</p>
      </CenteredContentLowerThirdWrapper>
    )

    expect(screen.getByText("Hey")).toBeInTheDocument()
  })

  describe("when the user is the facilitator", () => {
    beforeEach(() => {
      const facilitatorProps = { ...defaultProps, currentUser: { is_facilitator: true } }

      renderWithRedux(
        <CenteredContentLowerThirdWrapper {...facilitatorProps}>
          <p>foo</p>
        </CenteredContentLowerThirdWrapper>
      )
    })

    it("renders a means of progressing the stage", () => {
      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("renders an extraneous div used for centering desktop content", () => {
      // The div doesn't have a role="presentation" attribute, so we need to query by class instead
      const emptyDivs = document.querySelectorAll(".three.wide.column.ui.computer.tablet.only")
      expect(emptyDivs.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe("when the user is not the facilitator", () => {
    beforeEach(() => {
      const nonFacilitatorProps = { ...defaultProps, currentUser: { is_facilitator: false } }

      renderWithRedux(
        <CenteredContentLowerThirdWrapper {...nonFacilitatorProps}>
          <p>foo</p>
        </CenteredContentLowerThirdWrapper>
      )
    })

    it("does not render a means of progressing the stage button", () => {
      expect(screen.queryByRole("button")).not.toBeInTheDocument()
    })

    it("does not render an extraneous div used for centering desktop content", () => {
      // The div doesn't have a role="presentation" attribute, so we need to query by class instead
      const emptyDivs = document.querySelectorAll(".three.wide.column.ui.computer.tablet.only")
      expect(emptyDivs.length).toEqual(0)
    })
  })
})
