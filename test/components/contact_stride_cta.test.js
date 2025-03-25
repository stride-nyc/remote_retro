import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"

import ContactStrideCTA from "../../web/static/js/components/contact_stride_cta"

global.ASSET_DOMAIN = "test-domain"

const stubAlert = {
  headerText: "Crucial Text!",
  BodyComponent: () => <p>Derp!</p>,
}

const defaultProps = {
  currentUser: {
    name: "Travis Vander Hoop",
  },
  alert: stubAlert,
}

describe("<ContactStrideCTA />", () => {
  describe("when there is no alert to display to the user", () => {
    test("applies an active class to the wrapper", () => {
      const { container } = render(
        <ContactStrideCTA
          {...defaultProps}
          alert={null}
        />
      )

      // Check for the active class on the wrapper
      expect(container.querySelector(".active")).toBeInTheDocument()
    })
  })

  describe("when there is an alert to display to the user", () => {
    test("does not apply an active class to the wrapper", () => {
      const { container } = render(
        <ContactStrideCTA
          {...defaultProps}
          alert={stubAlert}
        />
      )

      // Check that there's no element with active class
      expect(container.querySelector(".active")).not.toBeInTheDocument()
    })
  })
})
