import React from "react"
import { shallow } from "enzyme"

import IdeaGroup from "../../web/static/js/components/idea_group"

describe("IdeaGroup component", () => {
  const defaultProps = {
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
})
