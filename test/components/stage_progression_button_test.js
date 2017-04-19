import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"


describe("StageProgressionButton", () => {
  const mockRetroChannel = { on: () => {}, push: () => {} }

  context("when the stage is 'idea-generation'", () => {
    let stageProgressionButton

    beforeEach(() => {
      stageProgressionButton = mount(
        <StageProgressionButton retroChannel={mockRetroChannel} stage="idea-generation" />
      )
    })

    it("displays Proceed to Action Items", () => {
      expect(stageProgressionButton.text()).to.match(/proceed to action items/i)
    })

    it("uses a right-pointing arrow icon", () => {
      expect(stageProgressionButton.find("i").hasClass("arrow")).to.equal(true)
    })
  })

  context("when the stage is 'action-items'", () => {
    let stageProgressionButton

    beforeEach(() => {
      stageProgressionButton = mount(
        <StageProgressionButton retroChannel={mockRetroChannel} stage="action-items" />
      )
    })

    it("displays 'Send Action Items'", () => {
      expect(stageProgressionButton.text()).to.match(/send action items/i)
    })

    it("uses a 'send' icon", () => {
      expect(stageProgressionButton.find("i").hasClass("send")).to.equal(true)
    })
  })

  context("onClick", () => {
    it("invokes a javascript confirmation", () => {
      const confirmSpy = sinon.spy(global, "confirm")

      const wrapper = mount(
        <StageProgressionButton retroChannel={mockRetroChannel} stage="idea-generation" />
      )

      wrapper.simulate("click")
      expect(confirmSpy.called).to.equal(true)

      confirmSpy.restore()
    })

    describe("stage progression confirmation", () => {
      let confirmStub
      let stageProgressionButton
      let retroChannel

      beforeEach(() => {
        confirmStub = sinon.stub(global, "confirm")
        retroChannel = { on: () => {}, push: sinon.spy() }

        stageProgressionButton = mount(
          <StageProgressionButton retroChannel={retroChannel} stage="idea-generation" />
        )
      })

      afterEach(() => {
        confirmStub.restore()
      })

      context("when the user confirms", () => {
        it("pushes `proceed_to_next_stage` to the retroChannel, passing the next stage", () => {
          confirmStub.returns(true)
          stageProgressionButton.simulate("click")

          expect(
            retroChannel.push.calledWith("proceed_to_next_stage", { stage: "action-items" })
          ).to.equal(true)
        })
      })

      context("when the user does not confirm", () => {
        it("does not push an event to the retro channel", () => {
          confirmStub.returns(false)
          stageProgressionButton.simulate("click")

          expect(
            retroChannel.push.called
          ).to.equal(false)
        })
      })
    })
  })
})
