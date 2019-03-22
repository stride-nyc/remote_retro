import React from "react"
import { shallow } from "enzyme"

import ViewportMetaTag from "../../web/static/js/components/viewport_meta_tag"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, GROUPING } = STAGES

describe("ViewportMetaTag component", () => {
  const defaultProps = {
    browserOrientation: "landscape",
    stage: IDEA_GENERATION,
  }

  context("when in the grouping stage", () => {
    const stage = GROUPING

    context("when there is an alert object", () => {
      const alert = { header: "Love", body: "is all there is" }

      it("renders a viewport meta tag with a width of the device width to ensure readability of the alert", () => {
        const wrapper = shallow(
          <ViewportMetaTag {...defaultProps} stage={stage} alert={alert} />
        )

        expect(
          wrapper.find("meta[name='viewport']").prop("content")
        ).to.match(/width=device-width/)
      })
    })

    context("when there is no alert object provided", () => {
      const alert = null

      context("when the browser orientation is portrait", () => {
        it("renders a viewport meta tag with a width of the device width to ensure readability of the dimmer content", () => {
          const wrapper = shallow(
            <ViewportMetaTag {...defaultProps} stage={stage} alert={alert} browserOrientation="portrait" />
          )

          expect(
            wrapper.find("meta[name='viewport']").prop("content")
          ).to.match(/width=device-width/)
        })
      })

      context("when the browser orientation is landscape", () => {
        it("sets viewport to 1440 to ensure mobile and desktop boards are identical", () => {
          const wrapper = shallow(
            <ViewportMetaTag {...defaultProps} stage={stage} alert={alert} browserOrientation="landscape" />
          )

          expect(
            wrapper.find("meta[name='viewport']").prop("content")
          ).to.eql("width=1440")
        })
      })
    })
  })

  context("when in a stage *other* than grouping", () => {
    const stage = IDEA_GENERATION

    it("sets a viewport width to the device width regardless of alert status", () => {
      const potentialAlertCases = [null, { body: "You've broken your mind" }]

      potentialAlertCases.forEach(alertCase => {
        const wrapper = shallow(
          <ViewportMetaTag {...defaultProps} stage={stage} alert={alertCase} />
        )

        expect(
          wrapper.find("meta[name='viewport']").prop("content")
        ).to.match(/width=device-width/)
      })
    })
  })
})
