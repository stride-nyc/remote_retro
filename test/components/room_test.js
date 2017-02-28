import React from "react"
import { shallow, mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import Room from "../../web/static/js/components/room"

describe("Room component", () => {
  let mockRetroChannel

  beforeEach(() => {
    mockRetroChannel = { push: sinon.spy(), on: () => {} }
  })

  describe("componentWillReceiveProps", () => {
    it("plays chime when the user list length changes", () => {
      const roomWrapper = mount(<Room retroChannel={mockRetroChannel} users={[]} />)

      const audioElement = roomWrapper.instance().chime
      audioElement.play = sinon.spy()
      expect(audioElement.play.called).to.equal(false)

      roomWrapper.setProps({ users: [{}, {}] })
      expect(audioElement.play.called).to.equal(true)
    })
  })

  describe(".handleIdeaSubmission", () => {
    it("pushes the idea to the room channel", () => {
      const roomComponent = shallow(<Room retroChannel={mockRetroChannel} users={[]} />)

      roomComponent
        .instance()
        .handleIdeaSubmission({ category: "sad", body: "we don't use our linter" })

      expect(
        mockRetroChannel.push.calledWith("new_idea", { category: "sad", body: "we don't use our linter" }),
      ).to.equal(true)
    })
  })
})
