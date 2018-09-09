import React from "react"
import sinon from "sinon"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("StageProgressionButton", () => {
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const mockButtonConfig = {
    confirmationMessage: "Are you sure?",
    nextStage: "stageDos",
    progressionButton: {
      copy: "Proceed to stage dos",
      iconClass: "arrow right",
    },
  }

  const defaultProps = {
    retroChannel: mockRetroChannel,
    config: mockButtonConfig,
    buttonDisabled: false,
    currentUser: { is_facilitator: true },
  }

  let stageProgressionButton

  describe("when passed a config", () => {
    beforeEach(() => {
      stageProgressionButton = mountWithConnectedSubcomponents(
        <StageProgressionButton {...defaultProps} />
      )
    })

    it("displays the button text from the given config", () => {
      expect(stageProgressionButton.text()).to.match(/proceed to stage dos/i)
    })

    it("uses the icon class from the given config", () => {
      expect(stageProgressionButton.find("i").hasClass("arrow")).to.equal(true)
    })

    context("onClick", () => {
      context("when the stage progression config requires confirmation", () => {
        let stageProgressionButton
        let retroChannel

        beforeEach(() => {
          retroChannel = { on: () => {}, push: sinon.spy() }

          stageProgressionButton = mountWithConnectedSubcomponents(
            <StageProgressionButton {...defaultProps} retroChannel={retroChannel} />
          )
        })

        context("when the stage progression button is clicked", () => {
          beforeEach(() => {
            stageProgressionButton.find("button.fluid.right.button").simulate("click")
          })

          it("opens the modal", () => {
            expect(stageProgressionButton.find("Modal").props().isOpen).to.equal(true)
          })

          context("when clicking yes in the open modal", () => {
            beforeEach(() => {
              stageProgressionButton.find("#yes").simulate("click")
            })

            it("pushes `retro_edited` to the retroChannel, passing the next stage", () => {
              expect(
                retroChannel.push.calledWith("retro_edited", { stage: "stageDos" })
              ).to.equal(true)
            })
          })

          context("when clicking no in the open modal", () => {
            beforeEach(() => {
              stageProgressionButton.find("#no").simulate("click")
            })

            it("does not push an event to the retro channel", () => {
              expect(
                retroChannel.push.called
              ).to.equal(false)
            })

            it("closes the modal", () => {
              expect(stageProgressionButton.find("Modal").props().isOpen).to.equal(false)
            })
          })
        })
      })
    })

    context("when the user is not a facilitator", () => {
      beforeEach(() => {
        const props = { ...defaultProps, currentUser: { is_facilitator: false } }
        stageProgressionButton = mountWithConnectedSubcomponents(
          <StageProgressionButton {...props} />
        )
      })

      it("does not render", () => {
        expect(stageProgressionButton.find("div")).to.have.length(0)
      })
    })
  })

  describe("when it does not receive a progressionButton configuration object", () => {
    beforeEach(() => {
      stageProgressionButton = mountWithConnectedSubcomponents(
        <StageProgressionButton {...defaultProps} config={{ progressionButton: null }} />
      )
    })

    it("does not render", () => {
      expect(stageProgressionButton.find("div")).to.have.length(0)
    })
  })
})
