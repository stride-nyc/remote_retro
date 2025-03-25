import React from "react"
import { screen, fireEvent, cleanup } from "@testing-library/react"
import "@testing-library/jest-dom"

import { StageProgressionButton } from "../../web/static/js/components/stage_progression_button"
import { renderWithRedux } from "../support/js/jest_test_helper"

describe("StageProgressionButton", () => {
  const actions = { updateRetroAsync: jest.fn() }
  const config = {
    nextStage: "stageDos",
    copy: "Proceed to stage dos",
    iconClass: "arrow right",
    confirmationMessageHTML: "Are you sure?",
  }

  const defaultProps = {
    actions,
    config,
    buttonDisabled: false,
    currentUser: { is_facilitator: true },
    className: "",
    reduxState: {},
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe("when passed a config", () => {
    it("displays the button text from the given config", () => {
      renderWithRedux(<StageProgressionButton {...defaultProps} />)
      expect(screen.getByText(/proceed to stage dos/i)).toBeInTheDocument()
    })

    it("uses the icon class from the given config", () => {
      renderWithRedux(<StageProgressionButton {...defaultProps} />)
      const icon = document.querySelector("i.arrow.right.icon")
      expect(icon).toBeInTheDocument()
    })

    describe("onClick", () => {
      it("opens the modal", () => {
        const { container } = renderWithRedux(<StageProgressionButton {...defaultProps} />)
        const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
        fireEvent.click(button)
        expect(screen.getByText("Are you sure?")).toBeInTheDocument()
      })

      describe("when the retroUpdateRequested prop is true", () => {
        it("renders the 'yes' button in a loading state", () => {
          const { container } = renderWithRedux(
            <StageProgressionButton {...defaultProps} retroUpdateRequested />
          )
          const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
          fireEvent.click(button)
          expect(screen.getByText("Yes").className).toMatch(/loading/i)
        })

        it("renders the 'no' button in a disabled state", () => {
          const { container } = renderWithRedux(
            <StageProgressionButton {...defaultProps} retroUpdateRequested />
          )
          const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
          fireEvent.click(button)
          expect(screen.getByText("No").className).toMatch(/disabled/i)
        })
      })

      describe("when the retroUpdateRequested prop is false", () => {
        it("does *not* render the 'yes' button in a 'loading' state", () => {
          const { container } = renderWithRedux(
            <StageProgressionButton {...defaultProps} retroUpdateRequested={false} />
          )
          const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
          fireEvent.click(button)
          expect(screen.getByText("Yes").className).not.toMatch(/loading/i)
        })

        it("does *not* render the 'no' button in a disabled state", () => {
          const { container } = renderWithRedux(
            <StageProgressionButton {...defaultProps} retroUpdateRequested={false} />
          )
          const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
          fireEvent.click(button)
          expect(screen.getByText("No").className).not.toMatch(/disabled/i)
        })
      })

      describe("when clicking yes in the open modal", () => {
        it("invokes the `updateRetroAsync` action, passing the next stage", () => {
          const { container } = renderWithRedux(<StageProgressionButton {...defaultProps} />)
          const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
          fireEvent.click(button)
          fireEvent.click(screen.getByText("Yes"))
          expect(actions.updateRetroAsync).toHaveBeenCalledWith(expect.objectContaining({ stage: "stageDos" }))
        })

        describe("when the config has a progression param augmentation function", () => {
          it("includes the key-values returned when updating the retro", () => {
            const configWithParamAugmenterFunc = {
              ...config,
              optionalParamsAugmenter: () => ({ some: "values" }),
            }

            const { container } = renderWithRedux(
              <StageProgressionButton
                {...defaultProps}
                config={configWithParamAugmenterFunc}
              />
            )

            const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
            fireEvent.click(button)
            fireEvent.click(screen.getByText("Yes"))

            expect(actions.updateRetroAsync).toHaveBeenCalledWith(
              expect.objectContaining({ some: "values" })
            )
          })
        })
      })

      describe("when clicking no in the open modal", () => {
        it("does not invoke the updateRetroAsync action creator", () => {
          const { container } = renderWithRedux(<StageProgressionButton {...defaultProps} />)
          const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
          fireEvent.click(button)
          fireEvent.click(screen.getByText("No"))
          expect(actions.updateRetroAsync).not.toHaveBeenCalled()
        })

        it("closes the modal", () => {
          const { container } = renderWithRedux(<StageProgressionButton {...defaultProps} />)
          const button = container.querySelector("button.fluid.ui.right.labeled.blue.icon.button")
          fireEvent.click(button)
          fireEvent.click(screen.getByText("No"))
          expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument()
        })
      })
    })

    describe("when the user is not a facilitator", () => {
      it("does not render", () => {
        const props = { ...defaultProps, currentUser: { is_facilitator: false } }
        renderWithRedux(<StageProgressionButton {...props} />)
        expect(screen.queryByText(/proceed to stage dos/i)).not.toBeInTheDocument()
      })
    })

    describe("when stateDependentTooltip returns a value", () => {
      it("renders tooltip", () => {
        const props = {
          ...defaultProps,
          config: { ...config, stateDependentTooltip: () => "All in!" },
        }
        renderWithRedux(<StageProgressionButton {...props} />)
        expect(screen.getByText("All in!")).toBeInTheDocument()
      })
    })

    describe("when stateDependentTooltip does not return a value", () => {
      it("does not render tooltip", () => {
        const props = {
          ...defaultProps,
          config: { ...config, stateDependentTooltip: () => null },
        }
        renderWithRedux(<StageProgressionButton {...props} />)
        expect(screen.queryByText("All in!")).not.toBeInTheDocument()
      })
    })

    describe("when stateDependentTooltip does not exist", () => {
      it("does not render tooltip", () => {
        renderWithRedux(<StageProgressionButton {...defaultProps} />)
        expect(document.querySelector(".tooltip")).toBeNull()
      })
    })
  })

  describe("when it does not receive a progressionButton configuration object", () => {
    it("does not render", () => {
      renderWithRedux(<StageProgressionButton {...defaultProps} config={null} />)
      expect(screen.queryByText(/proceed to stage dos/i)).not.toBeInTheDocument()
    })
  })
})
