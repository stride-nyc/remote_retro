import React from "react"
import { shallow } from "enzyme"

import ContactStrideCTA from "../web/static/js/components/contact_stride_cta"

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
      const wrapper = shallow(
        <ContactStrideCTA
          {...defaultProps}
          alert={null}
        />
      )

      expect(wrapper.find(".active")).toHaveLength(1)
    })
  })

  describe("when there *is* an alert to display to the user", () => {
    test("does *not* apply an active class to the wrapper", () => {
      const wrapper = shallow(
        <ContactStrideCTA
          {...defaultProps}
          alert={stubAlert}
        />
      )

      expect(wrapper.find(".active")).toHaveLength(0)
    })
  })
})
