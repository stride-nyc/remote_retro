import React from "react"
import { shallow } from "enzyme"

import IdeaList from "../../web/static/js/components/idea_list"
import Idea from "../../web/static/js/components/idea"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

describe("IdeaList", () => {
  const defaultProps = {
    currentUser: { given_name: "daniel", is_facilitator: true },
    isTabletOrAbove: false,
    ideaGenerationCategories: [],
    votes: [],
    ideas: [],
    stage: IDEA_GENERATION,
    category: "confused",
    alert: null,
  }

  it("renders an idea component for each idea given", () => {
    const ideas = [{
      id: 5,
      body: "should be first after stage change alert removed",
      category: "confused",
      vote_count: 16,
    }, {
      id: 2,
      body: "should be first at outset",
      category: "confused",
      vote_count: 1,
    }]

    const wrapper = shallow(
      <IdeaList
        {...defaultProps}
        ideas={ideas}
      />, { disableLifecycleMethods: true }
    )

    const ideaComponents = wrapper.find(Idea)
    expect(ideaComponents.length).to.eql(2)
  })
})
