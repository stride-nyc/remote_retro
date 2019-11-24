import React from "react"
import { shallow } from "enzyme"

import { GroupNamingStage } from "../../web/static/js/components/group_naming_stage"
import IdeaGroup from "../../web/static/js/components/idea_group"

describe("GroupNamingStage component", () => {
  const defaultProps = {
    groupsWithAssociatedIdeas: [{
      id: 5,
    }, {
      id: 6,
    }],
    actions: {},
    currentUser: {},
    stage: "idea-generation",
    stageConfig: {},
    ideas: [],
  }

  it("renders a IdeaGroup component for every group given", () => {
    const wrapper = shallow(
      <GroupNamingStage {...defaultProps} />
    )

    expect(wrapper.find(IdeaGroup)).to.have.length(2)
  })
})
