import React from "react"
import { mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"


describe("StageProgressionButton", () => {
  context("onClick", () => {
    it("invokes a javascript confirmation", () => {
      const mockRetroChannel = { on: () => {}, push: () => {} }
      const confirmSpy = sinon.spy(global, "confirm")

      const wrapper = mount(<StageProgressionButton retroChannel={mockRetroChannel} />)

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

        stageProgressionButton = mount(<StageProgressionButton retroChannel={retroChannel} />)
      })

      afterEach(() => {
        confirmStub.restore()
      })

      context("when the user confirms", () => {
        it("pushes a `proceed_to_next_stage` event to the retro channel with stage: 'action-items'", () => {
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
