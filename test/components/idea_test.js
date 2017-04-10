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

  context("when the idea is in its default state", () => {
    const presence = { user: { is_facilitator: false } }
    const wrapper = shallow(
      <Idea idea={idea} currentPresence={presence} handleDelete={handleDeleteStub} />)

    it("does not have a raised appearance", () => {
      expect(wrapper.hasClass("raised")).to.equal(false)
    })
  })

  context("when the idea is being edited", () => {
    const presence = { user: { is_facilitator: false } }
    const wrapper = shallow(
      <Idea idea={idea} currentPresence={presence} handleDelete={handleDeleteStub} />)
    wrapper.setState({ editing: true })

    it("has a raised appearance", () => {
      expect(wrapper.hasClass("ui")).to.equal(true)
      expect(wrapper.hasClass("raised")).to.equal(true)
      expect(wrapper.hasClass("segment")).to.equal(true)
    })
  })
})
