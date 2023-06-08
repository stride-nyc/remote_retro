import React from "react"
import sinon from "sinon"
import { shallow } from "enzyme"

import { StageHelp } from "../../web/static/js/components/stage_help"

describe("<StageHelp />", () => {
  let wrapper

  const actions = {
    showStageHelp: sinon.spy(),
  }

  const defaultProps = {
    actions,
    stageConfig: {
      help: {
        header: "Oh yeah, here's some help for ya",
      },
    },
  }

  describe("when it is a stage with help to show", () => {
    beforeEach(() => {
      // Setup JSDom so that reactDOM can be injected using createPortal
      const iconRoot = global.document.createElement("button")
      iconRoot.setAttribute("id", "stage-help-icon")
      const body = global.document.querySelector("body")
      body.appendChild(iconRoot)

      wrapper = shallow(<StageHelp {...defaultProps} />)
    })

    it("renders the question mark icon", () => {
      expect(wrapper.find("i.question").exists()).to.equal(true)
    })

    describe("when clicking the icon for help", () => {
      it("dispatches showStageHelp with the stage's help config", () => {
        wrapper.find("button").simulate("click")
        expect(actions.showStageHelp).to.have.been.calledWith({
          header: "Oh yeah, here's some help for ya",
        })
      })
    })
  })

  describe("when it is a stage with no help to show", () => {
    beforeEach(() => {
      const newProps = {
        ...defaultProps,
        stageConfig: {
          help: null,
        },
      }

      wrapper = shallow(<StageHelp {...newProps} />)
    })

    it("does NOT render the question mark icon", () => {
      expect(wrapper.find("i.question").exists()).to.equal(false)
    })
  })
})
