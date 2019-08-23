import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import CenteredContentLowerThirdWrapper from "../../web/static/js/components/centered_content_lower_third_wrapper"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("CenteredContentLowerThirdWrapper", () => {
  const defaultProps = {
    currentUser: {},
    children: <p>Fart</p>,
    actions: {},
    stageConfig: { progressionButton: {} },
    userOptions: { highContrastOn: false },
  }

  it("renders the children passed", () => {
    const wrapper = shallow(
      <CenteredContentLowerThirdWrapper {...defaultProps}>
        <p>Hey</p>
      </CenteredContentLowerThirdWrapper>
    )

    expect(wrapper.find("p").prop("children")).to.eql("Hey")
  })

  context("when high contrast is On", () => {
    it("renders Turn High Contrast Off", () => {
      const wrapper = shallow(
        <CenteredContentLowerThirdWrapper
          {...defaultProps}
          userOptions={{ highContrastOn: true }}
        />
      )
      expect(wrapper.find("button").text()).to.contain("Off")
    })
  })

  context("when high contrast is Off", () => {
    it("renders Turn High Contrast On", () => {
      const wrapper = shallow(
        <CenteredContentLowerThirdWrapper
          {...defaultProps}
          userOptions={{ highContrastOn: false }}
        />
      )
      expect(wrapper.find("button").text()).to.contain("On")
    })
  })

  describe("clicking high contrast button", () => {
    let actions

    beforeEach(() => {
      actions = { toggleHighContrastOn: sinon.spy() }

      const wrapper = shallow(
        <CenteredContentLowerThirdWrapper {...defaultProps} actions={actions} />
      )
      wrapper.find("button").simulate("click")
    })

    it("invokes the toggleHighContrastOn action", () => {
      expect(actions.toggleHighContrastOn).called
    })
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
        <CenteredContentLowerThirdWrapper
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
