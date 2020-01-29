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
      label: "Internet Culture",
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
      it("invokes submitGroupLabelChanges with the group attributes", () => {
        const groupWithAssociatedIdeasAndVotes = {
          id: 777,
          label: "some previous label",
          ideas: [],
          votes: [],
        }

        const submitGroupLabelChangesSpy = sinon.spy()
        const wrapper = shallow(
          <IdeaGroup
            {...defaultProps}
            currentUser={{ is_facilitator: true }}
            groupWithAssociatedIdeasAndVotes={groupWithAssociatedIdeasAndVotes}
            actions={{ submitGroupLabelChanges: submitGroupLabelChangesSpy }}
          />
        )

        const input = wrapper.find("input")
        input.simulate("blur", { target: { value: "Turtles" } })

        expect(submitGroupLabelChangesSpy).to.have.been.calledWith(groupWithAssociatedIdeasAndVotes, "Turtles")
      })
    })

    it("does *not* render the group label in a paragraph tag", () => {
      const labelParagraphTag = wrapper.find("p").findWhere(pTag => pTag.text() === "Internet Culture")

      expect(labelParagraphTag.exists()).to.equal(false)
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

    it("renders the group label as text", () => {
      const labelParagraphTag = wrapper.find("p").findWhere(pTag => pTag.text() === "Internet Culture")

      expect(labelParagraphTag.exists()).to.equal(true)
    })
  })
})
