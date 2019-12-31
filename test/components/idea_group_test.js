import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import IdeaGroup from "../../web/static/js/components/idea_group"

describe("IdeaGroup component", () => {
  const defaultProps = {
    actions: {},
    currentUser: {},
    groupWithAssociatedIdeasAndVotes: {
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

  context("when the user is a facilitator", () => {
    it("renders an input field", () => {
      const wrapper = shallow(
        <IdeaGroup {...defaultProps} currentUser={{ is_facilitator: true }} />
      )

      const input = wrapper.find("input")

      expect(input.length).to.eql(1)
    })

    it("invokes submitGroupNameChanges with the group attributes and the input value on blur", () => {
      const groupWithAssociatedIdeasAndVotes = {
        id: 777,
        name: "some previous name",
        ideas: [],
        votes: [],
      }

      const submitGroupNameChangesSpy = sinon.spy()
      const wrapper = shallow(
        <IdeaGroup
          {...defaultProps}
          currentUser={{ is_facilitator: true }}
          groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
          actions={{ submitGroupNameChanges: submitGroupNameChangesSpy }}
        />
      )

      const input = wrapper.find("input")
      input.simulate("blur", { target: { value: "Turtles" } })

      expect(submitGroupNameChangesSpy).to.have.been.calledWith(groupWithAssociatedIdeasAndVotes, "Turtles")
    })
  })

  context("when the user is not a facilitator", () => {
    it("does not render an input field", () => {
      const wrapper = shallow(
        <IdeaGroup {...defaultProps} currentUser={{ is_facilitator: false }} />
      )

      const input = wrapper.find("input")

      expect(input.length).to.eql(0)
    })
  })
})
