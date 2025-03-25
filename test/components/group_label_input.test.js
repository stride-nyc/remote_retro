import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import renderWithRedux from "../support/js/render_with_redux"
import GroupLabelInput from "../../web/static/js/components/group_label_input"

const defaultProps = {
  groupWithAssociatedIdeasAndVotes: {
    id: 777,
    label: "some previous label",
    ideas: [],
    votes: [],
  },
  actions: {},
}

describe("GroupLabelInput component", () => {
  test("renders a character count of the label text out of a maximum of 20 on initial paint", () => {
    renderWithRedux(<GroupLabelInput {...defaultProps} />)
    expect(screen.getByText("19/20")).toBeInTheDocument()
  })

  describe("when the user changes the value", () => {
    test("invokes submitGroupLabelChanges with the group attributes", () => {
      const submitGroupLabelChangesMock = jest.fn()
      render(
        <GroupLabelInput
          {...defaultProps}
          actions={{ submitGroupLabelChanges: submitGroupLabelChangesMock }}
        />
      )

      const input = screen.getByPlaceholderText("Optional Group Label")
      fireEvent.change(input, { target: { value: "Turtles" } })

      expect(submitGroupLabelChangesMock).toHaveBeenCalledWith(
        defaultProps.groupWithAssociatedIdeasAndVotes,
        "Turtles"
      )
    })

    test("renders a character count of the updated label text out of a maximum of 20", () => {
      render(
        <GroupLabelInput
          {...defaultProps}
          actions={{ submitGroupLabelChanges: jest.fn() }}
        />
      )

      const input = screen.getByPlaceholderText("Optional Group Label")
      fireEvent.change(input, { target: { value: "Turtles" } })

      expect(screen.getByText("7/20")).toBeInTheDocument()
    })
  })

  describe("when the (persisted) group label in props changes over time", () => {
    test("adds a checkmark when the text input matches the group label from props", () => {
      const { rerender } = render(
        <GroupLabelInput
          {...defaultProps}
          actions={{ submitGroupLabelChanges: jest.fn() }}
        />
      )

      const newGroupWithAssociatedIdeasAndVotes = {
        id: 777,
        label: "a better label",
        ideas: [],
        votes: [],
      }

      rerender(
        <GroupLabelInput
          {...defaultProps}
          groupWithAssociatedIdeasAndVotes={newGroupWithAssociatedIdeasAndVotes}
          actions={{ submitGroupLabelChanges: jest.fn() }}
        />
      )

      const input = screen.getByPlaceholderText("Optional Group Label")
      fireEvent.change(input, { target: { value: "a better label" } })

      // Check for the presence of the checkmark
      const checkmark = document.querySelector(".check")
      expect(checkmark).toBeInTheDocument()
    })

    test("doesn't display a checkmark when the input value no longer matches the group label from props", () => {
      const { rerender } = render(
        <GroupLabelInput
          {...defaultProps}
          actions={{ submitGroupLabelChanges: jest.fn() }}
        />
      )

      const newGroupWithAssociatedIdeasAndVotes = {
        id: 777,
        label: "a better label",
        ideas: [],
        votes: [],
      }

      rerender(
        <GroupLabelInput
          {...defaultProps}
          groupWithAssociatedIdeasAndVotes={newGroupWithAssociatedIdeasAndVotes}
          actions={{ submitGroupLabelChanges: jest.fn() }}
        />
      )

      const input = screen.getByPlaceholderText("Optional Group Label")
      fireEvent.change(input, { target: { value: "some weird new label" } })

      // Check that the checkmark is not present
      const checkmark = document.querySelector(".check")
      expect(checkmark).not.toBeInTheDocument()
    })
  })
})
