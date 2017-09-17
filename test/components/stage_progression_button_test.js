import React from "react"
import { mount, ReactWrapper } from "enzyme"
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
      stageProgressionButton = mount(
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

          stageProgressionButton = mount(
            <StageProgressionButton {...defaultProps} retroChannel={retroChannel} />
          )
        })

        context("when the stage progression button is clicked", () => {
          let modalActions

          beforeEach(() => {
            stageProgressionButton.find("button").simulate("click")
            modalActions = new ReactWrapper(stageProgressionButton.instance().modalActionsRef, true)
          })

          it("opens the modal", () => {
            expect(stageProgressionButton.find("Modal").props().isOpen).to.equal(true)
          })

          context("when clicking yes in the open modal", () => {
            beforeEach(() => {
              modalActions.find("#yes").simulate("click")
            })

            it("pushes `proceed_to_next_stage` to the retroChannel, passing the next stage", () => {
              expect(
                retroChannel.push.calledWith("proceed_to_next_stage", { stage: "stageDos" })
              ).to.equal(true)
            })

            it("closes the modal", () => {
              expect(stageProgressionButton.find("Modal").props().isOpen).to.equal(false)
            })
          })

          context("when clicking no in the open modal", () => {
            beforeEach(() => {
              modalActions.find("#no").simulate("click")
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

      context("when the matching stage config lacks a `confirmationMessage`", () => {
        const mockButtonConfig = {
          confirmationMessage: null,
          nextStage: "stageTres",
          progressionButton: {
            copy: "blurg!",
            iconClass: "send",
          },
        }

        context("onClick", () => {
          let stageProgressionButton
          let retroChannel

          beforeEach(() => {
            retroChannel = { on: () => {}, push: sinon.spy() }

            const props = { ...defaultProps, retroChannel, config: mockButtonConfig }
            stageProgressionButton = mount(<StageProgressionButton {...props} />)
            stageProgressionButton.find("button").simulate("click")
          })

          it("pushes `proceed_to_next_stage` to the retroChannel, passing the next stage", () => {
            expect(
              retroChannel.push.calledWith("proceed_to_next_stage", { stage: "stageTres" })
            ).to.equal(true)
          })
        })
      })
    })

    context("when the user is not a facilitator", () => {
      beforeEach(() => {
        const props = { ...defaultProps, currentUser: { is_facilitator: false } }
        stageProgressionButton = mount(
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
      stageProgressionButton = mount(
        <StageProgressionButton {...defaultProps} config={{ progressionButton: null }} />
      )
    })

    it("does not render", () => {
      expect(stageProgressionButton.find("div")).to.have.length(0)
    })
  })
})
