import React from "react"
import { shallow } from "enzyme"

import GroupLabelContainer from "../../web/static/js/components/group_label_container"

describe("GroupLabelContainer component", () => {
  const defaultProps = {
    actions: {},
    currentUser: {},
    stage: "closed",
    groupWithAssociatedIdeasAndVotes: {
      id: 5,
      label: "Internet Culture",
      ideas: [],
    },
  }

  context("when the user is a facilitator", () => {
    let wrapper

    context("when the stage is 'groups-labeling'", () => {
      beforeEach(() => {
        wrapper = shallow(
          <GroupLabelContainer
            {...defaultProps}
            currentUser={{ is_facilitator: true }}
            stage="groups-labeling"
          />
        )
      })

      it("renders an input for the group label", () => {
        const input = wrapper.find("GroupLabelInput")

        expect(input.length).to.eql(1)
      })

      it("does *not* render the group label in a paragraph tag", () => {
        const labelParagraphTag = wrapper.find("p.readonly-group-label").findWhere(pTag => pTag.text() === "Internet Culture")

        expect(labelParagraphTag.exists()).to.equal(false)
      })
    })

    context("when the stage is something other than 'groups-labeling'", () => {
      beforeEach(() => {
        wrapper = shallow(
          <GroupLabelContainer
            {...defaultProps}
            currentUser={{ is_facilitator: true }}
            stage="groups-voting"
          />
        )
      })

      it("does *not* render an input for the group label", () => {
        const input = wrapper.find("GroupLabelInput")

        expect(input.length).to.eql(0)
      })

      describe("when the group has a label", () => {
        it("renders the group label as text", () => {
          const labelParagraphTag = wrapper.find("p.readonly-group-label").findWhere(pTag => pTag.text() === "Internet Culture")

          expect(labelParagraphTag.exists()).to.equal(true)
        })
      })

      describe("when the given group lacks a label", () => {
        it("renders 'Unlabeled' in the paragraph tag", () => {
          wrapper = shallow(
            <GroupLabelContainer
              {...defaultProps}
              currentUser={{ is_facilitator: true }}
              groupWithAssociatedIdeasAndVotes={{ id: 1, label: "" }}
            />
          )

          const pTagWithUnlabeledText = wrapper.find("p.readonly-group-label").findWhere(pTag => pTag.text() === "Unlabeled")
          expect(pTagWithUnlabeledText.exists()).to.eql(true)
        })
      })
    })
  })

  context("when the user is not a facilitator", () => {
    let wrapper

    before(() => {
      wrapper = shallow(
        <GroupLabelContainer {...defaultProps} currentUser={{ is_facilitator: false }} />
      )
    })

    it("does not render an input field", () => {
      const input = wrapper.find("GroupLabelInput")

      expect(input.length).to.eql(0)
    })

    describe("when the group has a label", () => {
      it("renders the group label as text", () => {
        const labelParagraphTag = wrapper.find("p.readonly-group-label").findWhere(pTag => pTag.text() === "Internet Culture")

        expect(labelParagraphTag.exists()).to.equal(true)
      })
    })

    describe("when the given group lacks a label", () => {
      it("renders 'Unlabeled' in the paragraph tag", () => {
        wrapper = shallow(
          <GroupLabelContainer
            {...defaultProps}
            currentUser={{ is_facilitator: false }}
            groupWithAssociatedIdeasAndVotes={{ id: 1, label: "" }}
          />
        )

        const pTagWithUnlabeledText = wrapper.find("p.readonly-group-label").findWhere(pTag => pTag.text() === "Unlabeled")
        expect(pTagWithUnlabeledText.exists()).to.eql(true)
      })
    })
  })
})
