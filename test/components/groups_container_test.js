import React from "react"
import { shallow } from "enzyme"

import { GroupsContainer } from "../../web/static/js/components/groups_container"
import IdeaGroup from "../../web/static/js/components/idea_group"

describe("GroupsContainer component", () => {
  const defaultProps = {
    groupsWithAssociatedIdeasAndVotes: [{
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
      <GroupsContainer {...defaultProps} />
    )

    expect(wrapper.find(IdeaGroup)).to.have.length(2)
  })
})
