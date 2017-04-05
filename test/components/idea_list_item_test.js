import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import IdeaListItem from "../../web/static/js/components/idea_list_item"

describe("IdeaListItem component", () => {
  const idea = { category: "sad", body: "redundant tests", author: "Trizzle" }

  context("when the user is a facilitator", () => {
    const presence = { user: { facilitator: true } }
    const wrapper = shallow(<IdeaListItem idea={idea} currentPresence={presence} />)

    it("renders a delete button", () => {
      expect(wrapper.find("button").length).to.equal(1)
    })
  })

  context("when the user is not a facilitator", () => {
    const presence = { user: { facilitator: false } }
    const wrapper = shallow(<IdeaListItem idea={idea} currentPresence={presence} />)

    it("does not render a delete button", () => {
      expect(wrapper.find("button").length).to.equal(0)
    })
  })
})
