import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("StageProgressionButton", () => {
  it("invokes the method passed as onToggleActionItem on change", () => {
    const onToggleActionItemSpy = sinon.spy()

    const wrapper = mount(<StageProgressionButton onToggleActionItem={onToggleActionItemSpy} />)

    const actionItemsToggle = wrapper.find("input[type='checkbox']")
    actionItemsToggle.simulate("change")
    expect(onToggleActionItemSpy.called).to.equal(true)
  })
})
