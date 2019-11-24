import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import IdeaEditForm from "../../web/static/js/components/idea_edit_form"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, ACTION_ITEMS } = STAGES

describe("<IdeaEditForm />", () => {
  const idea = { id: 999, body: "  redundant tests   ", userId: 1 }
  const stage = IDEA_GENERATION
  const currentUser = { id: 7, name: "Helga Foggybottom", is_facilitator: true }
  const mockActions = { submitIdeaEditAsync: () => {}, broadcastIdeaLiveEdit: () => {} }
  const defaultProps = {
    idea,
    currentUser,
    actions: mockActions,
    stage,
    ideaGenerationCategories: ["happy", "sad", "confused"],
    users: [{
      id: 7,
      name: "Helga Foggybottom",
    }, {
      id: 9,
      name: "Prudence Pumpernickel",
    }],
  }

  describe("on initial render", () => {
    it("is pre-populated with the given idea's body text", () => {
      const wrapper = shallow(<IdeaEditForm {...defaultProps} />)

      const textAreaValue = wrapper.find("textarea").props().value
      expect(textAreaValue).to.equal(idea.body)
    })
  })

  describe("the action item phase", () => {
    context("when all collaborators are in the room", () => {
      const testProps = {
        ...defaultProps,
        idea: { id: 1000, body: "do the thing", userId: 1, assignee_id: 9 },
        stage: ACTION_ITEMS,
      }

      it("lists participants as potential assignees", () => {
        const form = mountWithConnectedSubcomponents(<IdeaEditForm {...testProps} />)

        const gripers = form.find("select[name='editable_assignee'] option")
        expect(gripers.map(option => option.text())).to.eql(["Helga Foggybottom", "Prudence Pumpernickel"])
      })

      it("shows the assigned user as selected initially", () => {
        const form = mountWithConnectedSubcomponents(<IdeaEditForm {...testProps} />)

        const { value } = form.find("select[name='editable_assignee']").props()
        expect(value).to.equal(9)
      })
    })
  })

  describe("on change of the textarea", () => {
    let textarea
    let wrapper

    beforeEach(() => {
      wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} />
      )
      textarea = wrapper.find("textarea")
    })

    it("the value prop of the textarea updates in turn", () => {
      textarea.simulate("change", { target: { name: "editable_idea", value: "some value" } })
      textarea = wrapper.find("textarea")
      expect(textarea.props().value).to.equal("some value")
    })

    describe("when the entered value is an empty string", () => {
      beforeEach(() => {
        textarea.simulate("change", { target: { name: "editable_idea", value: "" } })
      })

      it("the form submission button is disabled", () => {
        const submitButton = wrapper.find("button[type='submit']")
        expect(submitButton.prop("disabled")).to.equal(true)
      })

      it("an error is rendered", () => {
        expect(wrapper.find(".error").exists()).to.equal(true)
      })
    })

    describe("when the entered value is a string > 255 chars", () => {
      const stringGreaterThan255Chars = "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
      beforeEach(() => {
        textarea.simulate("change", { target: { name: "editable_idea", value: stringGreaterThan255Chars } })
      })

      it("the form submission button is disabled", () => {
        const submitButton = wrapper.find("button[type='submit']")
        expect(submitButton.prop("disabled")).to.equal(true)
      })

      it("an error is rendered", () => {
        expect(wrapper.find(".error").exists()).to.equal(true)
      })
    })

    describe("when the entered value is a string < 255 chars with non-whitespace chars", () => {
      beforeEach(() => {
        textarea.simulate("change", { target: { name: "editable_idea", value: "hey there" } })
      })

      it("the form submission button is *not* disabled", () => {
        const submitButton = wrapper.find("button[type='submit']")
        expect(submitButton.prop("disabled")).to.equal(false)
      })

      it("no errors are rendered", () => {
        expect(wrapper.find(".error.message").exists()).to.equal(false)
      })

      context("when the currentUser is the facilitator", () => {
        context("when ideas are *not* authored by the facilitator", () => {
          it("invokes the broadcastIdeaLiveEdit action, passing id and current input value", () => {
            const actions = { broadcastIdeaLiveEdit: sinon.spy() }

            const wrapper = mountWithConnectedSubcomponents(
              <IdeaEditForm {...defaultProps} actions={actions} />
            )

            const textarea = wrapper.find("textarea")

            textarea.simulate("change", { target: { name: "editable_idea", value: "some value" } })

            expect(actions.broadcastIdeaLiveEdit).calledWith({ id: idea.id, liveEditText: "some value" })
          })
        })

        context("when the idea is authored by the facilitator", () => {
          it("does not invoke the broadcastIdeaLiveEdit action", () => {
            const testProps = {
              ...defaultProps,
              idea: { id: 1000, body: "do the thing", user_id: currentUser.id, assignee_id: 9 },
            }

            const actions = { broadcastIdeaLiveEdit: sinon.spy() }

            wrapper = mountWithConnectedSubcomponents(
              <IdeaEditForm {...testProps} actions={actions} />
            )

            textarea = wrapper.find("textarea")
            textarea.simulate("change", { target: { name: "editable_idea", value: "some value" } })

            expect(
              actions.broadcastIdeaLiveEdit
            ).not.called
          })
        })
      })

      context("when the currentUser is *not* the facilitator", () => {
        let actions

        beforeEach(() => {
          actions = { broadcastIdeaLiveEdit: sinon.spy() }

          wrapper = mountWithConnectedSubcomponents(
            <IdeaEditForm
              {...defaultProps}
              actions={actions}
              currentUser={{ is_facilitator: false }}
            />
          )
          textarea = wrapper.find("textarea")
          textarea.simulate("change", { target: { value: "some value" } })
        })

        it("does not invoke the broadcastIdeaLiveEdit action", () => {
          expect(
            actions.broadcastIdeaLiveEdit
          ).not.called
        })
      })
    })
  })

  describe("on change of the category", () => {
    let categoryDropdown
    let wrapper

    context("when the stage is 'action-items'", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <IdeaEditForm {...defaultProps} stage="action-items" />
        )
      })

      it("the category dropdown is not visible", () => {
        expect(wrapper.find("select[name='editable_category']").exists()).to.equal(false)
      })
    })

    context("when the stage is not 'action-items'", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <IdeaEditForm {...defaultProps} stage="voting" />
        )
        categoryDropdown = wrapper.find("select")
        categoryDropdown.simulate("change", { target: { name: "editable_category", value: "confused" } })
      })

      it("the value prop of the category updates in turn", () => {
        expect(wrapper.find("select").props().value).to.equal("confused")
      })
    })
  })

  describe("on submitting the form", () => {
    it("invokes the submitIdeaEditAsync action with input body trimmed", () => {
      const actions = { submitIdeaEditAsync: sinon.spy() }

      const wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} actions={actions} />
      )
      const saveButton = wrapper.find("button[type='submit']")

      saveButton.simulate("submit")

      expect(actions.submitIdeaEditAsync).calledWith({
        id: idea.id,
        body: idea.body.trim(),
        category: idea.category,
        assignee_id: undefined,
      })
    })
  })

  describe("on cancelling out of the edit form", () => {
    it("invokes the cancelIdeaEditState action", () => {
      const actions = { cancelIdeaEditState: sinon.spy() }

      const wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} actions={actions} />
      )
      const cancelButton = wrapper.find("button.cancel.button")

      cancelButton.simulate("click")

      expect(actions.cancelIdeaEditState).calledWith(idea.id)
    })
  })
})
