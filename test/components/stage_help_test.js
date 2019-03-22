import React from "react"
import sinon from "sinon"
import { shallow } from "enzyme"

import { StageHelp } from "../../web/static/js/components/stage_help"
import STAGES from "../../web/static/js/configs/stages"

describe("<StageHelp />", () => {
  let wrapper
  let retro

  // Setup JSDom so that react can inject a portal
  const iconRoot = global.document.createElement("div")
  iconRoot.setAttribute("id", "stage-help-icon")
  const body = global.document.querySelector("body")
  body.appendChild(iconRoot)

  const actions = {
    showStageHelp: sinon.spy(),
  }

  const defaultProps = {
    actions,
    retro: {},
  }

  describe("when it is a stage with help to show", () => {
    beforeEach(() => {
      retro = { stage: STAGES.IDEA_GENERATION }
      const newProps = { ...defaultProps, retro }
      wrapper = shallow(<StageHelp {...newProps} />)
    })

    it("renders the question mark icon", () => {
      expect(wrapper.find("i.question").exists()).to.equal(true)
    })

    describe("when clicking the icon for help", () => {
      it("dispatches showStageHelp with the retro object", () => {
        wrapper.find("i.question").simulate("click")
        expect(actions.showStageHelp).to.have.been.calledWith(retro)
      })
    })
  })

  describe("when it is a stage with no help to show", () => {
    beforeEach(() => {
      const retro = { stage: STAGES.LOBBY }
      const newProps = { ...defaultProps, retro }
      wrapper = shallow(<StageHelp {...newProps} />)
    })

    it("does NOT render the question mark icon", () => {
      expect(wrapper.find("i.question").exists()).to.equal(false)
    })
  })
})
