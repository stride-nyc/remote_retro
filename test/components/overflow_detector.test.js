import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import OverflowDetector, { DomElementUtils } from "../../web/static/js/components/overflow_detector"

// rather than laboriously mock dom element client/scroll heights, we extract
// the overflow check logic out into a function we can unit test
describe("`DomElementUtils.isOverflowedY` helper", () => {
  describe("when the provided DOM element's content height is greater than the DOM element's height", () => {
    it("tells consumers that the element is overflowed", () => {
      const domElementAttrs = {
        scrollHeight: 80,
        clientHeight: 79,
      }

      expect(DomElementUtils.isOverflowedY(domElementAttrs)).toBe(true)
    })
  })

  describe("when the provided DOM element's content height equal to the DOM element's height", () => {
    it("tells consumers that the element isn't overflowed", () => {
      const domElementAttrs = {
        scrollHeight: 80,
        clientHeight: 80,
      }

      expect(DomElementUtils.isOverflowedY(domElementAttrs)).toBe(false)
    })
  })

  describe("when the provided DOM element's content height is less than the DOM element's height", () => {
    it("tells consumers that the element isn't overflowed", () => {
      const domElementAttrs = {
        scrollHeight: 60,
        clientHeight: 80,
      }

      expect(DomElementUtils.isOverflowedY(domElementAttrs)).toBe(false)
    })
  })
})

describe("<OverflowDetector />", () => {
  let isOverflowedYSpy
  const defaultProps = {
    children: <p>Playing gleefully</p>,
    elementType: "div",
    onOverflowChange: jest.fn(),
    className: "",
  }

  beforeEach(() => {
    jest.useFakeTimers()
    isOverflowedYSpy = jest.spyOn(DomElementUtils, "isOverflowedY")
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it("renders a wrapping element of the type passed in elementType", () => {
    const { container } = render(
      <OverflowDetector {...defaultProps} elementType="span" />
    )

    expect(container.firstChild.tagName.toLowerCase()).toBe("span")
  })

  it("passes the given className down to the wrapping element", () => {
    const { container } = render(
      <OverflowDetector {...defaultProps} className="pretty" />
    )

    expect(container.firstChild).toHaveClass("pretty")
  })

  it("renders the given children within the wrapping element", () => {
    render(
      <OverflowDetector {...defaultProps}>
        <p>Inner beauty</p>
      </OverflowDetector>
    )

    expect(screen.getByText(/inner beauty/i)).toBeInTheDocument()
  })

  describe("required mount logic", () => {
    let onOverflowChangeMock

    beforeEach(() => {
      onOverflowChangeMock = jest.fn()

      render(
        <OverflowDetector {...defaultProps} onOverflowChange={onOverflowChangeMock} />
      )
    })

    it("checks whether the element is overflowed after an interval", () => {
      expect(isOverflowedYSpy).not.toHaveBeenCalled()
      jest.advanceTimersByTime(350)
      expect(isOverflowedYSpy).toHaveBeenCalled()
    })

    describe("when passed an explicit interval greater than 300", () => {
      beforeEach(() => {
        // Reset mocks for a clean slate
        jest.clearAllMocks()

        render(
          <OverflowDetector
            {...defaultProps}
            onOverflowChange={onOverflowChangeMock}
            interval={2000}
          />
        )
      })

      it("doesnt check the overflow when 300ms (the default interval) have elapsed", () => {
        // We need to reset the timer and mock completely for this test
        jest.clearAllTimers()
        isOverflowedYSpy.mockReset()

        render(
          <OverflowDetector
            {...defaultProps}
            onOverflowChange={onOverflowChangeMock}
            interval={2000}
          />
        )

        jest.advanceTimersByTime(301)
        expect(isOverflowedYSpy).not.toHaveBeenCalled()
      })

      it("only checks whether the element is overflowed after the given interval", () => {
        expect(isOverflowedYSpy).not.toHaveBeenCalled()
        jest.advanceTimersByTime(2001)
        expect(isOverflowedYSpy).toHaveBeenCalled()
      })
    })

    describe("when between the intervals the overflow changes", () => {
      beforeEach(() => {
        // Mock implementation to return true
        isOverflowedYSpy.mockImplementation(() => true)
        jest.advanceTimersByTime(300)
      })

      it("invokes the `onOverflowChange` callback with the value", () => {
        expect(onOverflowChangeMock).toHaveBeenCalledWith(true)
      })

      describe("when between the intervals the overflow changes *again*", () => {
        beforeEach(() => {
          // Mock implementation to return false
          isOverflowedYSpy.mockImplementation(() => false)
          jest.advanceTimersByTime(300)
        })

        it("invokes the `onOverflowChange` callback with the new value", () => {
          expect(onOverflowChangeMock).toHaveBeenCalledWith(false)
        })
      })
    })

    describe("when between the intervals the overflow *doesn't* change", () => {
      it("does *not* invoke the `onOverflowChange` callback", () => {
        // Mock implementation to return false (default state is also false)
        isOverflowedYSpy.mockImplementation(() => false)
        jest.advanceTimersByTime(300)

        expect(onOverflowChangeMock).not.toHaveBeenCalled()
      })
    })
  })
})
