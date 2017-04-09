import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import Idea from "../../web/static/js/components/idea"

describe("Idea component", () => {
  const idea = { category: "sad", body: "redundant tests", author: "Trizzle" }

  context("when the user is a facilitator", () => {
    const presence = { user: { is_facilitator: true } }
    const wrapper = shallow(<Idea idea={idea} currentPresence={presence} />)

    it("renders an delete icon", () => {
      expect(wrapper.find(".remove.icon").length).to.equal(1)
    })

    it("renders an edit icon", () => {
      expect(wrapper.find(".edit.icon").length).to.equal(1)
    })
  })

  context("when the user is not a facilitator", () => {
    const presence = { user: { is_facilitator: false } }
    const wrapper = shallow(<Idea idea={idea} currentPresence={presence} />)

    it("does not render a delete icon", () => {
      expect(wrapper.find(".remove.icon").length).to.equal(0)
    })

    it("does not render an edit icon", () => {
      expect(wrapper.find(".edit.icon").length).to.equal(0)
    })
  })
})
