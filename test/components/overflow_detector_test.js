import React from "react"
import { mount } from "enzyme"
import sinon from "sinon"

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

      expect(DomElementUtils.isOverflowedY(domElementAttrs)).to.eql(true)
    })
  })

  describe("when the provided DOM element's content height equal to the DOM element's height", () => {
    it("tells consumers that the element isn't overflowed", () => {
      const domElementAttrs = {
        scrollHeight: 80,
        clientHeight: 80,
      }

      expect(DomElementUtils.isOverflowedY(domElementAttrs)).to.eql(false)
    })
  })

  describe("when the provided DOM element's content height is less than the DOM element's height", () => {
    it("tells consumers that the element isn't overflowed", () => {
      const domElementAttrs = {
        scrollHeight: 60,
        clientHeight: 80,
      }

      expect(DomElementUtils.isOverflowedY(domElementAttrs)).to.eql(false)
    })
  })
})

describe("<OverflowDetector />", () => {
  let clock
  let isOverflowedYSpy
  const defaultProps = {
    children: <p>Playing gleefully</p>,
    elementType: "div",
    onOverflowChange: () => {},
  }

  beforeEach(() => {
    isOverflowedYSpy = sinon.spy(DomElementUtils, "isOverflowedY")
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
    isOverflowedYSpy.restore()
  })

  it("renders a wrapping element of the type passed in elementType", () => {
    const wrapper = mount(
      <OverflowDetector {...defaultProps} elementType="span" />
    )

    expect(wrapper.childAt(0).type()).to.equal("span")
  })

  it("passes the given className down to the wrapping element", () => {
    const wrapper = mount(
      <OverflowDetector {...defaultProps} className="pretty" />
    )

    expect(wrapper.childAt(0).hasClass("pretty")).to.equal(true)
  })

  it("renders the given children within the wrapping element", () => {
    const wrapper = mount(
      <OverflowDetector {...defaultProps}>
        <p>Inner beauty</p>
      </OverflowDetector>
    )

    expect(wrapper.childAt(0).html()).to.match(/inner beauty/i)
  })

  describe("required mount logic", () => {
    let onOverflowChangeSpy

    beforeEach(() => {
      onOverflowChangeSpy = sinon.spy()

      mount(
        <OverflowDetector {...defaultProps} onOverflowChange={onOverflowChangeSpy} />
      )
    })

    it("checks whether the element is overflowed after an interval", () => {
      expect(() => {
        clock.tick(350)
      }).to.alter(() => isOverflowedYSpy.called, { from: false, to: true })
    })

    describe("when passed an explicit interval greater than 300", () => {
      beforeEach(() => {
        // renewing timers/spies necessary to ensure clean slate from ancestral beforeEach's
        clock.restore()
        clock = sinon.useFakeTimers()

        isOverflowedYSpy.restore()
        isOverflowedYSpy = sinon.spy(DomElementUtils, "isOverflowedY")

        mount(
          <OverflowDetector
            {...defaultProps}
            onOverflowChange={onOverflowChangeSpy}
            interval={2000}
          />
        )
      })

      it("doesnt check the overflow when 300ms (the default interval) have elapsed", () => {
        clock.tick(301)
        expect(isOverflowedYSpy).not.to.have.been.called
      })

      it("only checks whether the element is overflowed after the given interval", () => {
        expect(() => {
          clock.tick(2001)
        }).to.alter(() => isOverflowedYSpy.called, { from: false, to: true })
      })
    })

    describe("when between the intervals the overflow changes", () => {
      let isOverflowedYStub

      beforeEach(() => {
        isOverflowedYSpy.restore() // necessary to restore the spy before stubbing same method
        isOverflowedYStub = sinon.stub(DomElementUtils, "isOverflowedY").callsFake(() => true)
        clock.tick(300)
      })

      it("invokes the `onOverflowChange` callback with the value", () => {
        expect(onOverflowChangeSpy).to.have.been.calledWith(true)
        isOverflowedYStub.restore()
      })

      describe("when between the intervals the overflow changes *again*", () => {
        beforeEach(() => {
          isOverflowedYSpy.restore() // necessary to restore the spy before stubbing same method
          isOverflowedYStub = sinon.stub(DomElementUtils, "isOverflowedY").callsFake(() => false)
          clock.tick(300)
        })

        it("invokes the `onOverflowChange` callback with the new value", () => {
          expect(onOverflowChangeSpy).to.have.been.calledWith(false)
          isOverflowedYStub.restore()
        })
      })
    })

    describe("when between the intervals the overflow *doesn't* change", () => {
      it("does *not* invoke the `onOverflowChange` callback", () => {
        isOverflowedYSpy.restore() // necessary to restore the spy before stubbing same method
        const isOverflowedYStub = sinon.stub(DomElementUtils, "isOverflowedY").callsFake(() => false)
        clock.tick(300)

        expect(onOverflowChangeSpy).not.to.have.been.called
        isOverflowedYStub.restore()
      })
    })
  })
})
