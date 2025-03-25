import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"

import IdeaEditForm from "../../web/static/js/components/idea_edit_form"
import renderWithRedux from "../support/js/render_with_redux"

describe("<IdeaEditForm />", () => {
  const idea = { id: 999, body: "  redundant tests   ", userId: 1 }
  const currentUser = { id: 7, name: "Helga Foggybottom", is_facilitator: true }
  const mockActions = {
    submitIdeaEditAsync: jest.fn(),
    broadcastIdeaLiveEdit: jest.fn(),
    cancelIdeaEditState: jest.fn(),
  }
  const defaultProps = {
    idea,
    currentUser,
    actions: mockActions,
    isAnActionItemsStage: false,
    ideaGenerationCategories: ["happy", "sad", "confused"],
    users: [{
      id: 7,
      name: "Helga Foggybottom",
    }, {
      id: 9,
      name: "Prudence Pumpernickel",
    }],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("on initial render", () => {
    it("is pre-populated with the given idea's body text", () => {
      render(<IdeaEditForm {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      expect(textarea).toHaveValue(idea.body)
    })
  })

  describe("when in an action items stage", () => {
    const testProps = {
      ...defaultProps,
      idea: { id: 1000, body: "do the thing", userId: 1, assignee_id: 9 },
      isAnActionItemsStage: true,
    }

    it("lists participants as potential assignees", () => {
      renderWithRedux(<IdeaEditForm {...testProps} />)

      const assigneeSelect = screen.getByRole("combobox")
      const options = Array.from(assigneeSelect.options).map(option => option.textContent)

      expect(options).toEqual(["Helga Foggybottom", "Prudence Pumpernickel"])
    })

    it("shows the assigned user as selected initially", () => {
      renderWithRedux(<IdeaEditForm {...testProps} />)

      const assigneeSelect = screen.getByRole("combobox")
      expect(assigneeSelect.value).toBe("9")
    })
  })

  describe("on change of the textarea", () => {
    it("the value prop of the textarea updates in turn", () => {
      render(<IdeaEditForm {...defaultProps} />)

      const textarea = screen.getByRole("textbox")
      fireEvent.change(textarea, { target: { name: "editable_idea", value: "some value" } })

      expect(textarea).toHaveValue("some value")
    })

    describe("when the entered value is an empty string", () => {
      it("the form submission button is disabled", () => {
        render(<IdeaEditForm {...defaultProps} />)

        const textarea = screen.getByRole("textbox")
        fireEvent.change(textarea, { target: { name: "editable_idea", value: "" } })

        const submitButton = screen.getByRole("button", { name: /save/i })
        expect(submitButton).toBeDisabled()
      })

      it("an error is rendered", () => {
        render(<IdeaEditForm {...defaultProps} />)

        const textarea = screen.getByRole("textbox")
        fireEvent.change(textarea, { target: { name: "editable_idea", value: "" } })

        const errorMessage = screen.getByText(/ideas must have content/i)
        expect(errorMessage).toBeInTheDocument()
      })
    })

    describe("when the entered value is a string > 255 chars", () => {
      const stringGreaterThan255Chars = "d".repeat(256)

      it("the form submission button is disabled", () => {
        render(<IdeaEditForm {...defaultProps} />)

        const textarea = screen.getByRole("textbox")
        fireEvent.change(textarea, { target: { name: "editable_idea", value: stringGreaterThan255Chars } })

        const submitButton = screen.getByRole("button", { name: /save/i })
        expect(submitButton).toBeDisabled()
      })

      it("an error is rendered", () => {
        render(<IdeaEditForm {...defaultProps} />)

        const textarea = screen.getByRole("textbox")
        fireEvent.change(textarea, { target: { name: "editable_idea", value: stringGreaterThan255Chars } })

        const errorMessage = screen.getByText(/cannot exceed 255 characters/i)
        expect(errorMessage).toBeInTheDocument()
      })
    })

    describe("when the entered value is a string < 255 chars with non-whitespace chars", () => {
      it("the form submission button is *not* disabled", () => {
        render(<IdeaEditForm {...defaultProps} />)

        const textarea = screen.getByRole("textbox")
        fireEvent.change(textarea, { target: { name: "editable_idea", value: "hey there" } })

        const submitButton = screen.getByRole("button", { name: /save/i })
        expect(submitButton).not.toBeDisabled()
      })

      it("no errors are rendered", () => {
        render(<IdeaEditForm {...defaultProps} />)

        const textarea = screen.getByRole("textbox")
        fireEvent.change(textarea, { target: { name: "editable_idea", value: "hey there" } })

        const errorMessage = screen.queryByText(/ideas must have content/i)
        expect(errorMessage).not.toBeInTheDocument()
      })

      describe("when the currentUser is the facilitator", () => {
        describe("when ideas are *not* authored by the facilitator", () => {
          it("invokes the broadcastIdeaLiveEdit action, passing id and current input value", () => {
            const actions = {
              broadcastIdeaLiveEdit: jest.fn(),
              submitIdeaEditAsync: jest.fn(),
              cancelIdeaEditState: jest.fn(),
            }

            render(
              <IdeaEditForm {...defaultProps} actions={actions} />
            )

            const textarea = screen.getByRole("textbox")
            fireEvent.change(textarea, { target: { name: "editable_idea", value: "some value" } })

            expect(actions.broadcastIdeaLiveEdit).toHaveBeenCalledWith({
              id: idea.id,
              liveEditText: "some value",
            })
          })
        })

        describe("when the idea is authored by the facilitator", () => {
          it("does not invoke the broadcastIdeaLiveEdit action", () => {
            const testProps = {
              ...defaultProps,
              idea: { id: 1000, body: "do the thing", user_id: currentUser.id, assignee_id: 9 },
            }

            const actions = {
              broadcastIdeaLiveEdit: jest.fn(),
              submitIdeaEditAsync: jest.fn(),
              cancelIdeaEditState: jest.fn(),
            }

            render(
              <IdeaEditForm {...testProps} actions={actions} />
            )

            const textarea = screen.getByRole("textbox")
            fireEvent.change(textarea, { target: { name: "editable_idea", value: "some value" } })

            expect(actions.broadcastIdeaLiveEdit).not.toHaveBeenCalled()
          })
        })
      })

      describe("when the currentUser is *not* the facilitator", () => {
        it("does not invoke the broadcastIdeaLiveEdit action", () => {
          const actions = {
            broadcastIdeaLiveEdit: jest.fn(),
            submitIdeaEditAsync: jest.fn(),
            cancelIdeaEditState: jest.fn(),
          }

          render(
            <IdeaEditForm
              {...defaultProps}
              actions={actions}
              currentUser={{ is_facilitator: false }}
            />
          )

          const textarea = screen.getByRole("textbox")
          fireEvent.change(textarea, { target: { name: "editable_idea", value: "some value" } })

          expect(actions.broadcastIdeaLiveEdit).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe("on change of the category", () => {
    describe("when in an action items stage", () => {
      it("the category dropdown is not visible", () => {
        renderWithRedux(
          <IdeaEditForm {...defaultProps} isAnActionItemsStage />
        )

        // When in action items stage, the category dropdown should not be present
        // but the assignee dropdown will be
        const categoryDropdown = screen.queryByRole("combobox", { name: /editable_category/i })
        expect(categoryDropdown).toBeNull()
      })
    })

    describe("when not in an action items stage", () => {
      it("the value prop of the category updates in turn", () => {
        renderWithRedux(
          <IdeaEditForm {...defaultProps} isAnActionItemsStage={false} />
        )

        const categoryDropdown = screen.getByRole("combobox")
        fireEvent.change(categoryDropdown, { target: { value: "confused" } })

        expect(categoryDropdown.value).toBe("confused")
      })
    })
  })

  describe("on submitting the form", () => {
    it("invokes the submitIdeaEditAsync action with input body trimmed", () => {
      const actions = {
        submitIdeaEditAsync: jest.fn(),
        broadcastIdeaLiveEdit: jest.fn(),
        cancelIdeaEditState: jest.fn(),
      }

      render(
        <IdeaEditForm {...defaultProps} actions={actions} />
      )

      const saveButton = screen.getByRole("button", { name: /save/i })
      fireEvent.click(saveButton)

      expect(actions.submitIdeaEditAsync).toHaveBeenCalledWith({
        id: idea.id,
        body: idea.body.trim(),
        category: idea.category,
        assignee_id: undefined,
      })
    })
  })

  describe("on cancelling out of the edit form", () => {
    it("invokes the cancelIdeaEditState action", () => {
      const actions = {
        cancelIdeaEditState: jest.fn(),
        submitIdeaEditAsync: jest.fn(),
        broadcastIdeaLiveEdit: jest.fn(),
      }

      render(
        <IdeaEditForm {...defaultProps} actions={actions} />
      )

      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      fireEvent.click(cancelButton)

      expect(actions.cancelIdeaEditState).toHaveBeenCalledWith(idea.id)
    })
  })
})
