import React from "react"
import { shallow } from "enzyme"

import IdeaGroup from "../../web/static/js/components/idea_group"

describe("IdeaGroup component", () => {
  const defaultProps = {
    actions: {},
    currentUser: {},
    currentUserHasExhaustedVotes: false,
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
    stage: "groups-action-items",
  }

  it("renders a group label container", () => {
    const wrapper = shallow(
      <IdeaGroup {...defaultProps} />
    )

    const groupNameContainer = wrapper.find("GroupLabelContainer")

    expect(groupNameContainer.exists()).to.eql(true)
  })

  describe("when the stage is groups-labeling", () => {
    it("does not render a voting interface", () => {
      const wrapper = shallow(
        <IdeaGroup
          {...defaultProps}
          stage="groups-labeling"
        />
      )

      const votingInterface = wrapper.find("VotingInterface")

      expect(votingInterface.length).to.eql(0)
    })
  })

  describe("when the stage is *not* groups-labeling", () => {
    it("renders a voting interface", () => {
      const wrapper = shallow(
        <IdeaGroup
          {...defaultProps}
          stage="groups-action-items"
        />
      )

      const votingInterface = wrapper.find("VotingInterface")

      expect(votingInterface.length).to.eql(1)
    })
  })

  describe("when in the groups-voting stage", () => {
    it("renders a voting interface with isVotingStage true", () => {
      const wrapper = shallow(
        <IdeaGroup
          {...defaultProps}
          stage="groups-voting"
        />
      )

      const votingInterface = wrapper.find("VotingInterface")

      expect(votingInterface.prop("isVotingStage")).to.eql(true)
    })
  })

  describe("when in a stage other than group-labeling or groups-voting", () => {
    it("renders a voting interface with isVotingStage false", () => {
      const wrapper = shallow(
        <IdeaGroup
          {...defaultProps}
          stage="groups-action-items"
        />
      )

      const votingInterface = wrapper.find("VotingInterface")

      expect(votingInterface.prop("isVotingStage")).to.eql(false)
    })
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

  it("passes the currentUserHasExhaustedVotes value down to the voting interface", () => {
    const wrapper = shallow(
      <IdeaGroup
        {...defaultProps}
        currentUserHasExhaustedVotes
      />
    )

    const votingInterface = wrapper.find("VotingInterface")

    expect(votingInterface.prop("currentUserHasExhaustedVotes")).to.eql(true)
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
