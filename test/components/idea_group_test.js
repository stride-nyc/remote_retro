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
      name: "Internet Culture",
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
    let wrapper

    before(() => {
      wrapper = shallow(
        <IdeaGroup {...defaultProps} currentUser={{ is_facilitator: true }} />
      )
    })

    it("renders an input field", () => {
      const input = wrapper.find("input")

      expect(input.length).to.eql(1)
    })

    describe("upon blurring the input field", () => {
      it("invokes submitGroupNameChanges with the group attributes", () => {
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

    it("does *not* render the group name in a paragraph tag", () => {
      const namePTag = wrapper.find("p").findWhere(pTag => pTag.text() === "Internet Culture")

      expect(namePTag.exists()).to.equal(false)
    })
  })

  context("when the user is not a facilitator", () => {
    let wrapper

    before(() => {
      wrapper = shallow(
        <IdeaGroup {...defaultProps} currentUser={{ is_facilitator: false }} />
      )
    })
    it("does not render an input field", () => {
      const input = wrapper.find("input")

      expect(input.length).to.eql(0)
    })

    it("renders the group name as text", () => {
      const namePTag = wrapper.find("p").findWhere(pTag => pTag.text() === "Internet Culture")

      expect(namePTag.exists()).to.equal(true)
    })
  })
})
