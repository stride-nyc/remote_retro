import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import IdeaControls from "../../web/static/js/components/idea_controls"

describe("<IdeaControls />", () => {
  const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1 }

  describe("on click of the removal icon", () => {
    it("pushes an `delete_idea` event to the retro channel, passing the given idea's id", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = shallow(
        <IdeaControls idea={idea} retroChannel={retroChannel} />
      )

      wrapper.find(".remove.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("delete_idea", 666)
      ).to.equal(true)
    })
  })

  describe("on click of the edit icon", () => {
    it("pushes an `enable_edit_state` event to the retro channel, passing the given idea", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = shallow(
        <IdeaControls idea={idea} retroChannel={retroChannel} />
      )

      wrapper.find(".edit.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("enable_edit_state", idea)
      ).to.equal(true)
    })
  })

  describe("on click of the announcement icon", () => {
    it("pushes a `highlight_idea` event to the retro channel, passing the given idea's id and highlight state", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = shallow(
        <IdeaControls idea={idea} retroChannel={retroChannel} />
      )

      wrapper.find(".announcement.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("highlight_idea", { id: 666, isHighlighted: false })
      ).to.equal(true)
    })
  })

  describe("on click of the ban icon", () => {
    it("pushes a `highlight_idea` event to the retro channel, passing the given idea's id and highlight state", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }
      const highlightedIdea = Object.assign({}, idea, { isHighlighted: true })

      const wrapper = shallow(
        <IdeaControls idea={highlightedIdea} retroChannel={retroChannel} />
      )

      wrapper.find(".ban.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("highlight_idea", { id: 666, isHighlighted: true })
      ).to.equal(true)
    })
  })
})
