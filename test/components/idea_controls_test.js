import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaControls from "../../web/static/js/components/idea_controls"

describe("<IdeaControls />", () => {
  const idea = { id: 666, category: "sad", body: "redundant tests", author: "Trizzle" }

  describe("on click of the removal icon", () => {
    it("invokes the callback passed as handleDelete", () => {
      const handleDeleteSpy = sinon.spy()
      const mockRetroChannel = { on: () => {}, push: () => {} }

      const wrapper = shallow(
        <IdeaControls
          idea={idea}
          handleDelete={handleDeleteSpy}
          retroChannel={mockRetroChannel}
        />
      )

      wrapper.find(".remove.icon").simulate("click")
      expect(handleDeleteSpy.called).to.equal(true)
    })
  })

  describe("on click of the edit icon", () => {
    it("pushes an `enable_edit_state` event to the retro channel, passing the given idea", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = shallow(
        <IdeaControls
          idea={idea}
          handleDelete={() => {}}
          retroChannel={retroChannel}
        />
      )

      wrapper.find(".edit.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("enable_edit_state", idea)
      ).to.equal(true)
    })
  })
})
