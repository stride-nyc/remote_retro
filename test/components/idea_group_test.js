import React from "react"
import { shallow } from "enzyme"

import IdeaGroup from "../../web/static/js/components/idea_group"

describe("IdeaGroup component", () => {
  const defaultProps = {
    currentUser: {},
    groupWithAssociatedIdeas: {
      id: 5,
      ideas: [{
        id: 1,
        body: "I like turtles",
      }, {
        id: 2,
        body: "Memetown",
      }],
    },
  }

  it("renders an item for every idea associated with the given group", () => {
    const wrapper = shallow(
      <IdeaGroup {...defaultProps} />
    )

    const text = wrapper.find("li").map(li => li.text())

    expect(text).to.eql([
      "I like turtles",
      "Memetown",
    ])
  })

  it("renders an input field when the user is a facilitator", () => {
    const wrapper = shallow(
      <IdeaGroup {...defaultProps} currentUser={{ is_facilitator: true }} />
    )

    const input = wrapper.find("input")

    expect(input.length).to.eql(1)
  })

  it("renders an input field when the user is a facilitator", () => {
    const wrapper = shallow(
      <IdeaGroup {...defaultProps} currentUser={{ is_facilitator: false }} />
    )

    const input = wrapper.find("input")

    expect(input.length).to.eql(0)
  })
})
