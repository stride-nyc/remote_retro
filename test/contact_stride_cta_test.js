import React from "react"
import { shallow } from "enzyme"

import ContactStrideCTA from "../web/static/js/components/contact_stride_cta"

const stubAlert = {
  headerText: "Crucial Text!",
  BodyComponent: () => <p>Derp!</p>,
}

describe("<ContactStrideCTA />", () => {
  context("when there is no alert to display to the user", () => {
    it("applies an active class to the wrapper", () => {
      const wrapper = shallow(
        <ContactStrideCTA
          alert={null}
        />
      )

      expect(wrapper.find(".active")).to.have.lengthOf(1)
    })
  })

  context("when there *is* an alert to display to the user", () => {
    it("does *not* apply an active class to the wrapper", () => {
      const wrapper = shallow(
        <ContactStrideCTA
          alert={stubAlert}
        />
      )

      expect(wrapper.find(".active")).to.have.lengthOf(0)
    })
  })
})
