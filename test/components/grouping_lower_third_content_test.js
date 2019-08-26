import React from "react"
import { shallow } from "enzyme"

import GroupingLowerThirdContent from "../../web/static/js/components/grouping_lower_third_content"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("GroupingLowerThirdContent", () => {
  const defaultProps = {
    currentUser: {},
    children: <p>Fart</p>,
    actions: {},
    stageConfig: { progressionButton: {} },
    userOptions: { highContrastOn: false },
  }

  it("renders a means of toggling high contrast", () => {
    const wrapper = shallow(
      <GroupingLowerThirdContent {...defaultProps} />
    )
    expect(wrapper.find("HighContrastButton")).to.have.length(1)
  })

  context("when the user is the facilitator", () => {
    let wrapper

    beforeEach(() => {
      const currentUser = { is_facilitator: true }
      wrapper = shallow(
        <GroupingLowerThirdContent
          {...defaultProps}
          currentUser={currentUser}
        />
      )
    })

    it("renders the a means of progressing the stage", () => {
      expect(wrapper.find(StageProgressionButton)).to.have.length(1)
    })

    it("does not render an extraneous div used for centering desktop content", () => {
      expect(wrapper.findWhere(n => {
        return n.type() === "div" && !n.prop("children")
      })).to.have.length(0)
    })
  })

  context("when the user is not the facilitator", () => {
    let wrapper

    beforeEach(() => {
      const currentUser = { is_facilitator: false }
      wrapper = shallow(
        <GroupingLowerThirdContent
          {...defaultProps}
          currentUser={currentUser}
        />
      )
    })

    it("does not render a means of progressing the stage button", () => {
      expect(wrapper.find(StageProgressionButton)).to.have.length(0)
    })

    it("renders an extraneous div used for centering desktop content", () => {
      expect(wrapper.findWhere(n => {
        return n.type() === "div" && !n.prop("children")
      })).to.have.length(1)
    })
  })
})
