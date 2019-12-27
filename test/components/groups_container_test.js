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

  describe("when the groups are given in an unsorted order", () => {
    it("renders them by id ascending", () => {
      const props = {
        ...defaultProps,
        groupsWithAssociatedIdeasAndVotes: [{
          id: 102,
        }, {
          id: 100,
        }, {
          id: 101,
        }],
      }

      const wrapper = shallow(
        <GroupsContainer {...props} />
      )

      const ideaGroups = wrapper.find(IdeaGroup)
      const ideaGroupIds = ideaGroups.map(ideaGroup => (
        ideaGroup.prop("groupWithAssociatedIdeasAndVotes").id
      ))

      expect(ideaGroupIds).to.eql([
        100, 101, 102,
      ])
    })
  })
})
