import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"

import IdeaEditDeleteIcons from "../../web/static/js/components/idea_edit_delete_icons"

describe("<IdeaEditDeleteIcons />", () => {
  let idea = {}
  let actions = {}
  let defaultProps
  const mockUser = { id: 1, token: "abc", is_facilitator: true }

  beforeEach(() => {
    defaultProps = {
      currentUser: mockUser,
      idea,
      actions,
    }
  })

  describe("when idea in question is in an edit state", () => {
    test("disables", () => {
      idea = { id: 666, body: "redundant tests", user_id: 1, inEditState: true }

      const { container } = render(
        <IdeaEditDeleteIcons
          {...defaultProps}
          idea={idea}
        />
      )

      const iconContainer = container.querySelector("span")
      expect(iconContainer).toHaveClass("disabled")
    })
  })

  describe("when idea in question has been submitted for deletion", () => {
    test("disables", () => {
      idea = { id: 666, body: "redundant tests", user_id: 1, deletionSubmitted: true }

      const { container } = render(
        <IdeaEditDeleteIcons
          {...defaultProps}
          idea={idea}
        />
      )

      const iconContainer = container.querySelector("span")
      expect(iconContainer).toHaveClass("disabled")
    })
  })

  describe("when idea in question isnt in editing state and hasn't been submitted for deletion", () => {
    test("is not disabled", () => {
      idea = { id: 666, body: "redundant tests", user_id: 1, inEditState: false, deletionSubmitted: false }

      const { container } = render(
        <IdeaEditDeleteIcons
          {...defaultProps}
          idea={idea}
        />
      )

      const iconContainer = container.querySelector("span")
      expect(iconContainer).not.toHaveClass("disabled")
    })
  })

  describe("on click of the removal icon", () => {
    describe("when the user confirms the removal", () => {
      let originalConfirm

      beforeEach(() => {
        originalConfirm = window.confirm
        window.confirm = jest.fn(() => true)

        actions = { submitIdeaDeletionAsync: jest.fn() }
        idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

        render(
          <IdeaEditDeleteIcons
            {...defaultProps}
            actions={actions}
            idea={idea}
          />
        )

        const removalIcon = screen.getByTitle("Delete Idea")
        fireEvent.click(removalIcon)
      })

      afterEach(() => {
        window.confirm = originalConfirm
      })

      test("dispatches the submitIdeaDeletionAsync action with the idea id", () => {
        expect(actions.submitIdeaDeletionAsync).toHaveBeenCalledWith(666)
      })
    })

    describe("when the user does *not* confirm the removal", () => {
      let originalConfirm

      beforeEach(() => {
        originalConfirm = window.confirm
        window.confirm = jest.fn(() => false)

        actions = { submitIdeaDeletionAsync: jest.fn() }
        idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

        render(
          <IdeaEditDeleteIcons
            {...defaultProps}
            actions={actions}
            idea={idea}
          />
        )

        const removalIcon = screen.getByTitle("Delete Idea")
        fireEvent.click(removalIcon)
      })

      afterEach(() => {
        window.confirm = originalConfirm
      })

      test("no deletion action is dispatched", () => {
        expect(actions.submitIdeaDeletionAsync).not.toHaveBeenCalled()
      })
    })
  })

  describe("on click of the edit icon", () => {
    test("dispatches the initiateIdeaEditState action with the idea id", () => {
      actions = { initiateIdeaEditState: jest.fn() }
      idea = { id: 789, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

      render(
        <IdeaEditDeleteIcons
          {...defaultProps}
          actions={actions}
          idea={idea}
        />
      )

      const editIcon = screen.getByTitle("Edit Idea")
      fireEvent.click(editIcon)
      expect(actions.initiateIdeaEditState).toHaveBeenCalledWith(789)
    })
  })
})
