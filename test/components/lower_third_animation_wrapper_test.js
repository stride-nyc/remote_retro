import React from "react"
import { mount } from "enzyme"

import LowerThirdAnimationWrapper from "../../web/static/js/components/lower_third_animation_wrapper"

describe("LowerThirdAnimationWrapper component", () => {
  let lowerThird

  context("when displayContent is true", () => {
    beforeEach(() => {
      lowerThird = mount(
        <LowerThirdAnimationWrapper displayContents stage="herp">
          <p>Hello</p>
        </LowerThirdAnimationWrapper>
      )
    })

    it("renders components passed as children", () => {
      expect(lowerThird.text()).to.match(/hello/i)
    })
  })

  context("when displayContent is false", () => {
    beforeEach(() => {
      lowerThird = mount(
        <LowerThirdAnimationWrapper displayContents={false} stage="herp">
          <p>Hello</p>
        </LowerThirdAnimationWrapper>
      )
    })

    it("doesn't render the elements passed as children", () => {
      expect(lowerThird.text()).to.not.match(/hello/i)
    })
  })
})
