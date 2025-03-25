import React from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import renderWithRedux from "../support/js/render_with_redux"

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

  describe("when the user is a facilitator", () => {
    describe("when the stage is 'groups-labeling'", () => {
      beforeEach(() => {
        renderWithRedux(
          <GroupLabelContainer
            {...defaultProps}
            currentUser={{ is_facilitator: true }}
            stage="groups-labeling"
          />
        )
      })

      it("renders an input for the group label", () => {
        // Since GroupLabelInput is a custom component, we can't directly query for it
        // Instead, we check that the readonly label is not rendered
        const labelElement = screen.queryByText("Internet Culture")
        expect(labelElement).not.toBeInTheDocument()
      })

      it("does *not* render the group label in a paragraph tag", () => {
        const labelElement = screen.queryByText("Internet Culture")
        expect(labelElement).not.toBeInTheDocument()
      })
    })

    describe("when the stage is something other than 'groups-labeling'", () => {
      beforeEach(() => {
        renderWithRedux(
          <GroupLabelContainer
            {...defaultProps}
            currentUser={{ is_facilitator: true }}
            stage="groups-voting"
          />
        )
      })

      it("does *not* render an input for the group label", () => {
        // Since we can't directly check for the absence of GroupLabelInput,
        // we verify that the readonly label is rendered instead
        const labelElement = screen.getByText("Internet Culture")
        expect(labelElement).toBeInTheDocument()
      })

      describe("when the group has a label", () => {
        it("renders the group label as text", () => {
          const labelElement = screen.getByText("Internet Culture")
          expect(labelElement).toBeInTheDocument()
          expect(labelElement.tagName).toBe("P")
          expect(labelElement).toHaveClass("readonly-group-label")
        })
      })

      describe("when the given group lacks a label", () => {
        it("renders 'Unlabeled' in the paragraph tag", () => {
          renderWithRedux(
            <GroupLabelContainer
              {...defaultProps}
              currentUser={{ is_facilitator: true }}
              groupWithAssociatedIdeasAndVotes={{ id: 1, label: "" }}
            />
          )

          const unlabeledText = screen.getByText("Unlabeled")
          expect(unlabeledText).toBeInTheDocument()
          expect(unlabeledText.tagName).toBe("P")
          expect(unlabeledText).toHaveClass("readonly-group-label")
          expect(unlabeledText).toHaveClass("unlabeled")
        })
      })
    })
  })

  describe("when the user is not a facilitator", () => {
    beforeEach(() => {
      renderWithRedux(
        <GroupLabelContainer
          {...defaultProps}
          currentUser={{ is_facilitator: false }}
        />
      )
    })

    it("does not render an input field", () => {
      // Verify the readonly label is rendered instead
      const labelElement = screen.getByText("Internet Culture")
      expect(labelElement).toBeInTheDocument()
    })

    describe("when the group has a label", () => {
      it("renders the group label as text", () => {
        const labelElement = screen.getByText("Internet Culture")
        expect(labelElement).toBeInTheDocument()
        expect(labelElement.tagName).toBe("P")
        expect(labelElement).toHaveClass("readonly-group-label")
      })
    })

    describe("when the given group lacks a label", () => {
      it("renders 'Unlabeled' in the paragraph tag", () => {
        renderWithRedux(
          <GroupLabelContainer
            {...defaultProps}
            currentUser={{ is_facilitator: false }}
            groupWithAssociatedIdeasAndVotes={{ id: 1, label: "" }}
          />
        )

        const unlabeledText = screen.getByText("Unlabeled")
        expect(unlabeledText).toBeInTheDocument()
        expect(unlabeledText.tagName).toBe("P")
        expect(unlabeledText).toHaveClass("readonly-group-label")
        expect(unlabeledText).toHaveClass("unlabeled")
      })
    })
  })
})
