import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import ActionItemToggle from "../../web/static/js/components/action_item_toggle"

describe("ActionItemToggle", () => {
  it("invokes the method passed as onToggleActionItem on change", () => {
    const onToggleActionItemSpy = sinon.spy()

    const wrapper = mount(<ActionItemToggle onToggleActionItem={onToggleActionItemSpy} />)

    const actionItemsToggle = wrapper.find("input[type='checkbox']")
    actionItemsToggle.simulate("change")
    expect(onToggleActionItemSpy.called).to.equal(true)
  })
})
