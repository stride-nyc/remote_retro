import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"
import HighContrastButton from "../../web/static/js/components/high_contrast_button"

describe("HighContrastButton", () => {
  const defaultProps = {
    actions: {},
    userOptions: { highContrastOn: false },
  }

  it("renders class names for outter div", () => {
    const wrapper = shallow(
      <HighContrastButton {...defaultProps} className="sample-class" />
    )
    expect(wrapper.find("div").prop("className")).to.match(/sample-class/)
  })

  context("when high contrast is On", () => {
    it("renders Turn High Contrast Off", () => {
      const wrapper = shallow(
        <HighContrastButton {...defaultProps} userOptions={{ highContrastOn: true }} />
      )
      expect(wrapper.find("button").text()).to.contain("Off")
    })
  })

  context("when high contrast is Off", () => {
    it("renders Turn High Contrast On", () => {
      const wrapper = shallow(
        <HighContrastButton {...defaultProps} userOptions={{ highContrastOn: false }} />
      )
      expect(wrapper.find("button").text()).to.contain("On")
    })
  })

  describe("clicking high contrast button", () => {
    let actions

    beforeEach(() => {
      actions = { toggleHighContrastOn: sinon.spy() }

      const wrapper = shallow(
        <HighContrastButton {...defaultProps} actions={actions} />
      )
      wrapper.find("button").simulate("click")
    })

    it("invokes the toggleHighContrastOn action", () => {
      expect(actions.toggleHighContrastOn).called
    })
  })
})
