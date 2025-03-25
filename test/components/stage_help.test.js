import React from "react"
import { render, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"

import { StageHelp } from "../../web/static/js/components/stage_help"

describe("<StageHelp />", () => {
  // Setup JSDom so that react can inject a portal
  const setupPortalRoot = () => {
    const iconRoot = document.createElement("div")
    iconRoot.setAttribute("id", "stage-help-icon")
    document.body.appendChild(iconRoot)
  }

  beforeEach(() => {
    setupPortalRoot()
  })

  afterEach(() => {
    const iconRoot = document.getElementById("stage-help-icon")
    if (iconRoot) {
      document.body.removeChild(iconRoot)
    }
  })

  const actions = {
    showStageHelp: jest.fn(),
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
      render(<StageHelp {...defaultProps} />)
    })

    it("renders the question mark icon", () => {
      const questionIcon = document.querySelector("i.question")
      expect(questionIcon).toBeInTheDocument()
    })

    describe("when clicking the icon for help", () => {
      it("dispatches showStageHelp with the stage's help config", () => {
        const button = document.querySelector("button")
        fireEvent.click(button)
        expect(actions.showStageHelp).toHaveBeenCalledWith({
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

      render(<StageHelp {...newProps} />)
    })

    it("does NOT render the question mark icon", () => {
      const questionIcon = document.querySelector("i.question")
      expect(questionIcon).not.toBeInTheDocument()
    })
  })
})
