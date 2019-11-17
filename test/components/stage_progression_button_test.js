import React from "react"
import sinon from "sinon"

import { StageProgressionButton } from "../../web/static/js/components/stage_progression_button"

describe("StageProgressionButton", () => {
  const actions = { updateRetroAsync: () => {} }
  const config = {
    nextStage: "stageDos",
    copy: "Proceed to stage dos",
    iconClass: "arrow right",
    confirmationMessage: "Are you sure?",
  }

  const defaultProps = {
    actions,
    config,
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
      let stageProgressionButton
      let actions

      beforeEach(() => {
        actions = { updateRetroAsync: sinon.spy() }

        stageProgressionButton = mountWithConnectedSubcomponents(
          <StageProgressionButton {...defaultProps} actions={actions} />
        )
        stageProgressionButton.find("button.fluid.right.button").simulate("click")
      })

      it("opens the modal", () => {
        expect(stageProgressionButton.find("Modal").props().isOpen).to.equal(true)
      })

      context("when the retroUpdateRequested prop is true", () => {
        beforeEach(() => {
          actions = { updateRetroAsync: sinon.spy() }

          stageProgressionButton = mountWithConnectedSubcomponents(
            <StageProgressionButton {...defaultProps} retroUpdateRequested />
          )
          stageProgressionButton.find("button.fluid.right.button").simulate("click")
        })

        it("renders the 'yes' button in a loading state", () => {
          const name = stageProgressionButton.find("#yes").prop("className")
          expect(name).to.match(/loading/i)
        })

        it("renders the 'no' button in a disabled state", () => {
          const name = stageProgressionButton.find("#no").prop("className")
          expect(name).to.match(/disabled/i)
        })
      })

      context("when the retroUpdateRequested prop is false", () => {
        beforeEach(() => {
          actions = { updateRetroAsync: sinon.spy() }

          stageProgressionButton = mountWithConnectedSubcomponents(
            <StageProgressionButton {...defaultProps} retroUpdateRequested={false} />
          )
          stageProgressionButton.find("button.fluid.right.button").simulate("click")
        })

        it("does *not* render the 'yes' button in a 'loading' state", () => {
          const name = stageProgressionButton.find("#yes").prop("className")
          expect(name).to.not.match(/loading/i)
        })

        it("does *not* render the 'no' button in a disabled state", () => {
          const name = stageProgressionButton.find("#no").prop("className")
          expect(name).to.not.match(/disabled/i)
        })
      })

      context("when clicking yes in the open modal", () => {
        beforeEach(() => {
          stageProgressionButton.find("#yes").simulate("click")
        })

        it("invokes the `updateRetroAsync` action, passing the next stage", () => {
          expect(actions.updateRetroAsync).calledWithMatch({ stage: "stageDos" })
        })

        context("when the config has a progression param augmentation function", () => {
          beforeEach(() => {
            const configWithParamAugmenterFunc = { ...config, optionalParamsAugmenter: () => ({ some: "values" }) }

            stageProgressionButton = mountWithConnectedSubcomponents(
              <StageProgressionButton
                {...defaultProps}
                actions={actions}
                config={configWithParamAugmenterFunc}
              />
            )

            stageProgressionButton.find("button.fluid.right.button").simulate("click")
            stageProgressionButton.find("#yes").simulate("click")
          })

          it("includes the key-values returned when updating the retro", () => {
            expect(actions.updateRetroAsync).calledWithMatch({ some: "values" })
          })
        })
      })

      context("when clicking no in the open modal", () => {
        beforeEach(() => {
          stageProgressionButton.find("#no").simulate("click")
        })

        it("does not invoke the updateRetroAsync action creator", () => {
          expect(actions.updateRetroAsync).not.called
        })

        it("closes the modal", () => {
          expect(stageProgressionButton.find("Modal").props().isOpen).to.equal(false)
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

    context("when stateDependentTooltip returns a value", () => {
      beforeEach(() => {
        const props = {
          ...defaultProps,
          config: { ...config, stateDependentTooltip: () => "All in!" },
        }
        stageProgressionButton = mountWithConnectedSubcomponents(
          <StageProgressionButton {...props} />
        )
      })

      it("renders tooltip", () => {
        expect(stageProgressionButton.find(".tooltip").text()).to.equal("All in!")
      })
    })

    context("when stateDependentTooltip does not return a value", () => {
      beforeEach(() => {
        const props = {
          ...defaultProps,
          config: { ...config, stateDependentTooltip: () => null },
        }
        stageProgressionButton = mountWithConnectedSubcomponents(
          <StageProgressionButton {...props} />
        )
      })

      it("does not render tooltip", () => {
        expect(stageProgressionButton.find(".tooltip")).to.have.length(0)
      })
    })

    context("when stateDependentTooltip does not exisit", () => {
      beforeEach(() => {
        const props = {
          ...defaultProps,
        }
        stageProgressionButton = mountWithConnectedSubcomponents(
          <StageProgressionButton {...props} />
        )
      })

      it("does not render tooltip", () => {
        expect(stageProgressionButton.find(".tooltip")).to.have.length(0)
      })
    })
  })

  describe("when it does not receive a progressionButton configuration object", () => {
    beforeEach(() => {
      stageProgressionButton = mountWithConnectedSubcomponents(
        <StageProgressionButton {...defaultProps} config={null} />
      )
    })

    it("does not render", () => {
      expect(stageProgressionButton.find("div")).to.have.length(0)
    })
  })
})
