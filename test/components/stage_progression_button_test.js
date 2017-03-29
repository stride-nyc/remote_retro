import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("StageProgressionButton", () => {
  it("invokes the method passed as onProceedToActionItems on click", () => {
    const onProceedToActionItemsSpy = sinon.spy()

    const wrapper = mount(<StageProgressionButton onProceedToActionItems={onProceedToActionItemsSpy} />)

    wrapper.simulate("click")
    expect(onProceedToActionItemsSpy.called).to.equal(true)
  })
})
