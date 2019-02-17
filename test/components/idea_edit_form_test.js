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
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const mockActions = { submitIdeaEditAsync: () => {} }
  const defaultProps = {
    idea,
    currentUser,
    retroChannel: mockRetroChannel,
    actions: mockActions,
    stage,
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
    let retroChannel
    let textarea
    let wrapper

    beforeEach(() => {
      retroChannel = { on: () => {}, push: sinon.spy() }
      wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} retroChannel={retroChannel} />
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
        textarea.simulate("change", { target: { name: "editable_idea", value: "some value" } })
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
          it("pushes a `idea_live_edit` event to the retroChannel, passing current input value", () => {
            expect(
              retroChannel.push
            ).calledWith("idea_live_edit", { id: idea.id, liveEditText: "some value" })
          })
        })

        context("when ideas are authored by the facilitator", () => {
          it("does not push a `idea_live_edit` event to the retroChannel", () => {
            const testProps = {
              ...defaultProps,
              idea: { id: 1000, body: "do the thing", user_id: currentUser.id, assignee_id: 9 },
            }
            retroChannel = { on: () => {}, push: sinon.spy() }
            wrapper = mountWithConnectedSubcomponents(
              <IdeaEditForm {...testProps} retroChannel={retroChannel} />
            )
            textarea = wrapper.find("textarea")
            textarea.simulate("change", { target: { name: "editable_idea", value: "some value" } })

            expect(
              retroChannel.push
            ).not.called
          })
        })
      })

      context("when the currentUser is *not* the facilitator", () => {
        beforeEach(() => {
          retroChannel = { on: () => {}, push: sinon.spy() }
          wrapper = mountWithConnectedSubcomponents(
            <IdeaEditForm
              {...defaultProps}
              retroChannel={retroChannel}
              currentUser={{ is_facilitator: false }}
            />
          )
          textarea = wrapper.find("textarea")
          textarea.simulate("change", { target: { value: "some value" } })
        })

        it("does not push an `idea_live_edit` event to the retroChannel", () => {
          expect(
            retroChannel.push
          ).not.called
        })
      })
    })
  })

  describe("on change of the category", () => {
    let retroChannel
    let categoryDropdown
    let wrapper

    context("when the stage is 'action-items'", () => {
      beforeEach(() => {
        retroChannel = { on: () => { }, push: sinon.spy() }
        wrapper = mountWithConnectedSubcomponents(
          <IdeaEditForm {...defaultProps} stage="action-items" retroChannel={retroChannel} />
        )
      })

      it("the category dropdown is not visible", () => {
        expect(wrapper.find("select[name='editable_category']").exists()).to.equal(false)
      })
    })

    context("when the stage is not 'action-items'", () => {
      beforeEach(() => {
        retroChannel = { on: () => { }, push: sinon.spy() }
        wrapper = mountWithConnectedSubcomponents(
          <IdeaEditForm {...defaultProps} stage="voting" retroChannel={retroChannel} />
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
      const actions = { on: () => {}, submitIdeaEditAsync: sinon.spy() }

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
      const actions = { on: () => {}, cancelIdeaEditState: sinon.spy() }

      const wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} actions={actions} />
      )
      const cancelButton = wrapper.find("button.cancel.button")

      cancelButton.simulate("click")

      expect(actions.cancelIdeaEditState).calledWith(idea.id)
    })
  })
})
