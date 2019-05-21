import React from "react"
import { shallow } from "enzyme"

import CenteredContentLowerThirdWrapper from "../../web/static/js/components/centered_content_lower_third_wrapper"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("CenteredContentLowerThirdWrapper", () => {
  const defaultProps = {
    currentUser: {},
    children: <p>Fart</p>,
    actions: {},
    stageConfig: {},
  }

  it("renders the children passed", () => {
    const wrapper = shallow(
      <CenteredContentLowerThirdWrapper {...defaultProps}>
        <p>Hey</p>
      </CenteredContentLowerThirdWrapper>
    )

    expect(wrapper.find("p").prop("children")).to.eql("Hey")
  })

  context("when the user is the facilitator", () => {
    let wrapper

    beforeEach(() => {
      const currentUser = { is_facilitator: true }
      wrapper = shallow(
        <CenteredContentLowerThirdWrapper
          {...defaultProps}
          currentUser={currentUser}
        />
      )
    })

    it("renders the 'Proceed to Action Items button", () => {
      expect(wrapper.find(StageProgressionButton)).to.have.length(1)
    })

    it("renders an extraneous div used for centering desktop content", () => {
      expect(wrapper.findWhere(n => {
        return n.type() === "div" && !n.prop("children")
      })).to.have.length(1)
    })
  })

  context("when the user is not the facilitator", () => {
    let wrapper

    beforeEach(() => {
      const currentUser = { is_facilitator: false }
      wrapper = shallow(
        <CenteredContentLowerThirdWrapper
          {...defaultProps}
          currentUser={currentUser}
        />
      )
    })

    it("does not render the 'Proceed to [STAGE]' button", () => {
      expect(wrapper.find(StageProgressionButton)).to.have.length(0)
    })

    it("does not render an extraneous div used for centering desktop content", () => {
      expect(wrapper.findWhere(n => {
        return n.type() === "div" && !n.prop("children")
      })).to.have.length(0)
    })
  })
})
