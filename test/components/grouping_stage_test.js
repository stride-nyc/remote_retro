import React from "react"
import { shallow } from "enzyme"

import GroupingStage from "../../web/static/js/components/grouping_stage"

describe("GroupingStage component", () => {
  const defaultProps = {
    ideas: [],
    actions: {},
    currentUser: {},
    stage: "idea-generation",
    stageConfig: {},
    browser: {},
    userOptions: {},
  }

  context("when the browser is in portrait mode", () => {
    it("renders a dimmer over the content", () => {
      const wrapper = shallow(
        <GroupingStage {...defaultProps} browser={{ orientation: "portrait" }} />
      )

      expect(wrapper.find(".ui.dimmer")).to.have.length(1)
    })
  })

  context("when the browser is in landscape mode", () => {
    it("does *not* render a dimmer over the content", () => {
      const wrapper = shallow(
        <GroupingStage {...defaultProps} browser={{ orientation: "landscape" }} />
      )

      expect(wrapper.find(".ui.dimmer")).to.have.length(0)
    })
  })
})
