import React from "react"
import { shallow } from "enzyme"

import { GroupLabelingStage } from "../../web/static/js/components/group_labeling_stage"
import IdeaGroup from "../../web/static/js/components/idea_group"

describe("GroupLabelingStage component", () => {
  const defaultProps = {
    groupsWithAssociatedIdeas: [{
      id: 5,
    }, {
      id: 6,
    }],
    currentUser: {},
    retroChannel: {},
    stage: "idea-generation",
    stageConfig: {},
    ideas: [],
  }

  it("renders a IdeaGroup component for every group given", () => {
    const wrapper = shallow(
      <GroupLabelingStage {...defaultProps} />
    )

    expect(wrapper.find(IdeaGroup)).to.have.length(2)
  })
})
