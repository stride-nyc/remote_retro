/* eslint-disable react/prop-types */
import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"

import ViewportMetaTag from "../../web/static/js/components/viewport_meta_tag"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, GROUPING } = STAGES

jest.mock("react-helmet-async", () => ({
  Helmet: ({ children }) => <div data-testid="helmet-mock">{children}</div>,
}))

describe("ViewportMetaTag component", () => {
  const defaultProps = {
    browserOrientation: "landscape",
    stage: IDEA_GENERATION,
  }

  describe("when in the grouping stage", () => {
    const stage = GROUPING

    describe("when there is an alert object", () => {
      const alert = { header: "Love", body: "is all there is" }

      test("renders a viewport meta tag with a width of the device width to ensure readability of the alert", () => {
        const { container } = render(
          <ViewportMetaTag {...defaultProps} stage={stage} alert={alert} />
        )

        const metaTag = container.querySelector("meta[name=\"viewport\"]")
        expect(metaTag.getAttribute("content")).toMatch(/width=device-width/)
      })
    })

    describe("when there is no alert object provided", () => {
      const alert = null

      describe("when the browser orientation is portrait", () => {
        test("renders a viewport meta tag with a width of the device width to ensure readability of the dimmer content", () => {
          const { container } = render(
            <ViewportMetaTag {...defaultProps} stage={stage} alert={alert} browserOrientation="portrait" />
          )

          const metaTag = container.querySelector("meta[name=\"viewport\"]")
          expect(metaTag.getAttribute("content")).toMatch(/width=device-width/)
        })
      })

      describe("when the browser orientation is landscape", () => {
        test("sets viewport to 1440 to ensure mobile and desktop boards are identical", () => {
          const { container } = render(
            <ViewportMetaTag {...defaultProps} stage={stage} alert={alert} browserOrientation="landscape" />
          )

          const metaTag = container.querySelector("meta[name=\"viewport\"]")
          expect(metaTag.getAttribute("content")).toBe("width=1440")
        })
      })
    })
  })

  describe("when in a stage *other* than grouping", () => {
    const stage = IDEA_GENERATION

    test("sets a viewport width to the device width regardless of alert status", () => {
      const potentialAlertCases = [null, { body: "You've broken your mind" }]

      potentialAlertCases.forEach(alertCase => {
        const { container } = render(
          <ViewportMetaTag {...defaultProps} stage={stage} alert={alertCase} />
        )

        const metaTag = container.querySelector("meta[name=\"viewport\"]")
        expect(metaTag.getAttribute("content")).toMatch(/width=device-width/)
      })
    })
  })
})
