import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import Room from "../../web/static/js/components/room"

describe("Room component", () => {
  describe(".handleIdeaSubmission", () => {
    it("pushes the idea to the room channel", () => {
      const onStub = () => {}
      const roomChannel = { push: sinon.spy(), on: onStub }

      const roomComponent = shallow(
        <Room roomChannel={ roomChannel } users={ [] }/>
      )

      roomComponent
        .instance()
        .handleIdeaSubmission(":sad: we don't use our linter")

      expect(
        roomChannel.push.calledWith('new_idea', { body: ':sad: we don\'t use our linter' })
      ).to.equal(true)
    })
  })
})
