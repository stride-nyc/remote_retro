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

      const onProceedToActionItemsStub = () => {}
      const wrapper = mount(
        <StageProgressionButton
          onProceedToActionItems={onProceedToActionItemsStub}
          retroChannel={mockRetroChannel}
        />
      )

      wrapper.simulate("click")
      expect(confirmSpy.called).to.equal(true)

      confirmSpy.restore()
    })

    describe("stage progression confirmation", () => {
      let confirmStub
      let onProceedToActionItemsSpy
      let stageProgressionButton
      let retroChannel

      beforeEach(() => {
        confirmStub = sinon.stub(global, "confirm")
        onProceedToActionItemsSpy = sinon.spy()
        retroChannel = { on: () => {}, push: sinon.spy() }

        stageProgressionButton = mount(
          <StageProgressionButton
            onProceedToActionItems={onProceedToActionItemsSpy}
            retroChannel={retroChannel}
          />
        )
      })

      afterEach(() => {
        confirmStub.restore()
      })

      context("when the user confirms", () => {
        it("invokes the method passed as onProceedToActionItems", () => {
          confirmStub.returns(true)
          stageProgressionButton.simulate("click")

          expect(onProceedToActionItemsSpy.called).to.equal(true)
        })

        it("pushes a `show_action_item` event to the retro channel, passing show_action_item: true", () => {
          confirmStub.returns(true)
          stageProgressionButton.simulate("click")

          expect(
            retroChannel.push.calledWith("show_action_item", { show_action_item: true })
          ).to.equal(true)
        })
      })

      context("when the user does not confirm", () => {
        it("does not invoke the method passed as onProceedToActionItems", () => {
          confirmStub.returns(false)
          stageProgressionButton.simulate("click")

          expect(onProceedToActionItemsSpy.called).to.equal(false)
        })

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
