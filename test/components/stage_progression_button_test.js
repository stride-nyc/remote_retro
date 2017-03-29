import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("StageProgressionButton", () => {
  it("invokes the method passed as onToggleActionItem on click", () => {
    const onToggleActionItemSpy = sinon.spy()

    const wrapper = mount(<StageProgressionButton onToggleActionItem={onToggleActionItemSpy} />)

    wrapper.simulate("click")
    expect(onToggleActionItemSpy.called).to.equal(true)
  })
})
