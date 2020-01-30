import React from "react"
import { shallow } from "enzyme"

import { GroupsContainer } from "../../web/static/js/components/groups_container"
import IdeaGroup from "../../web/static/js/components/idea_group"

describe("GroupsContainer component", () => {
  const defaultProps = {
    groupsWithAssociatedIdeasAndVotes: [{
      id: 5,
      votes: [],
    }, {
      id: 6,
      votes: [],
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
    describe("when in the labeling-plus-voting stage", () => {
      it("renders them by id ascending", () => {
        const props = {
          ...defaultProps,
          stage: "labeling-plus-voting",
          groupsWithAssociatedIdeasAndVotes: [{
            id: 102,
            votes: [],
          }, {
            id: 100,
            votes: [],
          }, {
            id: 101,
            votes: [],
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

    describe("when in a stage *other than* voting", () => {
      describe("when one group has more votes than another", () => {
        it("renders them by vote count descending", () => {
          const props = {
            ...defaultProps,
            stage: "action-items",
            groupsWithAssociatedIdeasAndVotes: [{
              id: 2,
              votes: [],
            }, {
              id: 3,
              votes: [{ id: 100 }, { id: 101 }],
            }],
          }

          const wrapper = shallow(
            <GroupsContainer {...props} />
          )

          const ideaGroups = wrapper.find(IdeaGroup)
          const ideaGroupIds = ideaGroups.map(ideaGroup => (
            ideaGroup.prop("groupWithAssociatedIdeasAndVotes").id
          ))

          expect(ideaGroupIds).to.eql([3, 2])
        })
      })

      describe("when two groups have the same number of votes", () => {
        it("renders them by id ascending to ensure consistency across clients", () => {
          const props = {
            ...defaultProps,
            stage: "action-items",
            groupsWithAssociatedIdeasAndVotes: [{
              id: 2,
              votes: [],
            }, {
              id: 1,
              votes: [],
            }],
          }

          const wrapper = shallow(
            <GroupsContainer {...props} />
          )

          const ideaGroups = wrapper.find(IdeaGroup)
          const ideaGroupIds = ideaGroups.map(ideaGroup => (
            ideaGroup.prop("groupWithAssociatedIdeasAndVotes").id
          ))

          expect(ideaGroupIds).to.eql([1, 2])
        })
      })
    })
  })
})
