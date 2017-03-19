import React from "react"
import { shallow, mount } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import Room from "../../web/static/js/components/room"
import CategoryColumn from "../../web/static/js/components/category_column"
import RetroChannel from "../../web/static/js/services/retro_channel"

describe("Room component", () => {
  const mockRetroChannel = { push: sinon.spy(), on: () => {} }

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

  describe("Action item column", () => {
    it("is not visible on render", () => {
      const roomComponent = shallow(<Room retroChannel={mockRetroChannel} users={[]} />)

      expect(roomComponent.containsMatchingElement(
        <CategoryColumn category="action-item" ideas={[]} />,
      )).to.equal(false)
    })

    it("becomes visible when showActionItem is true", () => {
      const roomComponent = shallow(<Room retroChannel={mockRetroChannel} users={[]} />)
      roomComponent.setState({ showActionItem: true })

      expect(roomComponent.containsMatchingElement(
        <CategoryColumn category="action-item" ideas={[]} />,
      )).to.equal(true)
    })
  })

  describe("RetroChannel Events", () => {
    let retroChannel
    let roomComponent

    beforeEach(() => {
      retroChannel = RetroChannel.configure({})
      roomComponent = mount(<Room retroChannel={retroChannel} users={[]} />)
    })

    it("on `existing_ideas` sets the associated payload's `ideas` value on state", () => {
      expect(roomComponent.state("ideas")).to.eql([])

      const mockPayloadFromServer = { ideas: [{ arbitrary: "content" }] }
      retroChannel.trigger("existing_ideas", mockPayloadFromServer)

      expect(roomComponent.state("ideas")).to.eql([
        { arbitrary: "content" }
      ])
    })

    it("pushes the value passed with `new_idea_received` into the `ideas` array", () => {
      roomComponent.setState({ ideas: [{ body: "first idear" }]})

      retroChannel.trigger("new_idea_received", { body: "zerp" })

      expect(roomComponent.state("ideas")).to.eql([
        { body: "first idear" },
        { body: "zerp" },
      ])
    })
  })
})
