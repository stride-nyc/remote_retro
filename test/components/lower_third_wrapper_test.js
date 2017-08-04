import React from "react"
import { mount } from "enzyme"

import LowerThirdWrapper from "../../web/static/js/components/lower_third_wrapper"

describe("LowerThirdWrapper component", () => {
  let lowerThird

  context("when displayContent is true", () => {
    beforeEach(() => {
      lowerThird = mount(
        <LowerThirdWrapper displayContents>
          <p>Hello</p>
        </LowerThirdWrapper>
      )
    })

    it("renders components passed as children", () => {
      expect(lowerThird.text()).to.match(/hello/i)
    })
  })

  context("when displayContent is false", () => {
    beforeEach(() => {
      lowerThird = mount(
        <LowerThirdWrapper displayContents={false}>
          <p>Hello</p>
        </LowerThirdWrapper>
      )
    })

    it("doesn't render the elements passed as children", () => {
      expect(lowerThird.text()).to.not.match(/hello/i)
    })
  })
})
