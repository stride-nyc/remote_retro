import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import Idea from "../../web/static/js/components/idea"
import IdeaControls from "../../web/static/js/components/idea_controls"

describe("Idea component", () => {
  const idea = { category: "sad", body: "redundant tests", author: "Trizzle" }
  const handleDeleteStub = () => {}

  context("when the user is a facilitator", () => {
    const presence = { user: { is_facilitator: true } }
    const wrapper = shallow(
      <Idea idea={idea} currentPresence={presence} handleDelete={handleDeleteStub} />)

    it("renders <IdeaControls />", () => {
      expect(wrapper.find(IdeaControls).length).to.equal(1)
    })

    it("passes the handleDelete prop to <IdeaControls />", () => {
      const ideaControls = wrapper.find(IdeaControls)
      expect(ideaControls.props().handleDelete).to.equal(handleDeleteStub)
    })
  })

  context("when the user is not a facilitator", () => {
    const presence = { user: { is_facilitator: false } }
    const wrapper = shallow(
      <Idea idea={idea} currentPresence={presence} handleDelete={handleDeleteStub} />)

    it("does not render IdeaControls", () => {
      expect(wrapper.find(IdeaControls).length).to.equal(0)
    })
  })
})
