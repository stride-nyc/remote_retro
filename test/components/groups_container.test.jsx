import React from "react"
import { shallow } from "enzyme"

import { GroupsContainer } from "../../web/static/js/components/groups_container"
import IdeaGroup from "../../web/static/js/components/idea_group"
import CategoryColumn from "../../web/static/js/components/category_column"
import ContactStrideCTA from "../../web/static/js/components/contact_stride_cta"

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
    currentUserHasExhaustedVotes: false,
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

  describe("when in the groups-labeling stage", () => {
    it("does *not* render a category column", () => {
      const wrapper = shallow(
        <GroupsContainer {...defaultProps} stage="groups-labeling" />
      )

      const categoryColumn = wrapper.find(CategoryColumn)
      expect(categoryColumn.exists()).to.eql(false)
    })

    describe("when the groups are given in an unsorted order", () => {
      it("renders them by id ascending", () => {
        const props = {
          ...defaultProps,
          stage: "groups-labeling",
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
  })

  describe("when in the groups-voting stage", () => {
    it("does *not* render a category column", () => {
      const wrapper = shallow(
        <GroupsContainer {...defaultProps} stage="groups-voting" />
      )

      const categoryColumn = wrapper.find(CategoryColumn)
      expect(categoryColumn.exists()).to.eql(false)
    })

    describe("when the groups are given in an unsorted order", () => {
      it("renders them by id ascending", () => {
        const props = {
          ...defaultProps,
          stage: "groups-voting",
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
  })

  describe("when in a stage *other than* groups-labeling/groups-voting", () => {
    it("renders a category column for action items", () => {
      const wrapper = shallow(
        <GroupsContainer {...defaultProps} stage="closed" />
      )

      const categoryColumn = wrapper.find(CategoryColumn)
      expect(categoryColumn.prop("category")).to.eql("action-item")
    })

    describe("when the groups are given in an unsorted order", () => {
      describe("when one group has more votes than another", () => {
        it("renders them by vote count descending", () => {
          const props = {
            ...defaultProps,
            stage: "action-items",
            groupsWithAssociatedIdeasAndVotes: [{
              id: 4,
              votes: [{ id: 102 }],
            }, {
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

          expect(ideaGroupIds).to.eql([3, 4, 2])
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

  describe("when in the groups-closed stage", () => {
    describe("when the current user's locale indicates they're in the US timezone", () => {
      it("renders an ContactStrideCTA", () => {
        const wrapper = shallow(
          <GroupsContainer {...defaultProps} stage="groups-closed" currentUser={{ locale: "en" }} />
        )

        const contactStrideCTA = wrapper.find(ContactStrideCTA)
        expect(contactStrideCTA.exists()).to.eql(true)
      })
    })

    describe("when the current user's locale indicates they're outside a US timezone", () => {
      it("does not render a ContactStrideCTA", () => {
        const wrapper = shallow(
          <GroupsContainer {...defaultProps} stage="groups-closed" currentUser={{ locale: "en-GB" }} />
        )

        const contactStrideCTA = wrapper.find(ContactStrideCTA)
        expect(contactStrideCTA.exists()).to.eql(false)
      })
    })
  })

  describe("when in a stage *other than* 'groups-closed'", () => {
    it("does *not* render an ContactStrideCTA column", () => {
      const wrapper = shallow(
        <GroupsContainer {...defaultProps} stage="groups-action-items" />
      )

      const contactStrideCTA = wrapper.find(ContactStrideCTA)
      expect(contactStrideCTA.exists()).to.eql(false)
    })
  })
})
