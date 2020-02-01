import React from "react"
import { shallow } from "enzyme"

import IdeaGroup from "../../web/static/js/components/idea_group"

describe("IdeaGroup component", () => {
  const defaultProps = {
    actions: {},
    currentUser: {},
    groupWithAssociatedIdeasAndVotes: {
      id: 5,
      label: "Internet Culture",
      ideas: [{
        id: 1,
        body: "I like turtles",
      }, {
        id: 2,
        body: "Memetown",
      }],
      votes: [],
    },
    stage: "action-items",
  }

  it("renders a group label container", () => {
    const wrapper = shallow(
      <IdeaGroup {...defaultProps} />
    )

    const groupNameContainer = wrapper.find("GroupLabelContainer")

    expect(groupNameContainer.exists()).to.eql(true)
  })

  it("passes the first idea of the provided group to the voting interface as ideaToCastVoteFor", () => {
    const wrapper = shallow(
      <IdeaGroup
        {...defaultProps}
      />
    )

    const votingInterface = wrapper.find("VotingInterface")

    expect(votingInterface.prop("ideaToCastVoteFor")).to.eql({
      id: 1,
      body: "I like turtles",
    })
  })

  describe("when in the labeling-plus-voting stage", () => {
    it("renders a voting interface with isVotingStage true", () => {
      const wrapper = shallow(
        <IdeaGroup
          {...defaultProps}
          stage="labeling-plus-voting"
        />
      )

      const votingInterface = wrapper.find("VotingInterface")

      expect(votingInterface.prop("isVotingStage")).to.eql(true)
    })
  })

  describe("when in a stage other than labeling-plus-voting", () => {
    it("renders a voting interface with isVotingStage false", () => {
      const wrapper = shallow(
        <IdeaGroup
          {...defaultProps}
          stage="action-items"
        />
      )

      const votingInterface = wrapper.find("VotingInterface")

      expect(votingInterface.prop("isVotingStage")).to.eql(false)
    })
  })

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
