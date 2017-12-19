import React from "react"
import sinon from "sinon"

import { ActionItemSubmissionForm } from
  "../../web/static/js/components/action_item_submission_form"

describe("ActionItemSubmissionForm component", () => {
  let wrapper

  const stubUser = { given_name: "Mugatu", token: "xyz", id: 1 }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const fakeEvent = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined,
  }


  const users = [
    { id: 1, name: "Tina Fey" },
    { id: 2, name: "Betty White" },
    { id: 3, name: "Bill Smith" },
  ]

  describe("on submit", () => {
    it("pushes a `new_action_item` event to the retro channel with the action-item", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      wrapper = mountWithConnectedSubcomponents(
        <ActionItemSubmissionForm
          currentUser={stubUser}
          retroChannel={retroChannel}
          users={users}
        />
      )

      wrapper.setState({ assigneeId: 3, body: 'Some issue', actionItemEntryStarted: true })

      wrapper.simulate("submit", fakeEvent)

      expect(
        retroChannel.push.calledWith("new_action_item", {
          body: "Some issue",
          userId: 1,
          assigneeId: 3,
          actionItemEntryStarted: true,
        }
      )).to.equal(true)
    })
  })

  describe("on change of an action_item's body", () => {
    it("pushes a `user_typing_action_item` event to the retro channel, along with the user token", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      wrapper = mountWithConnectedSubcomponents(
        <ActionItemSubmissionForm
          currentUser={stubUser}
          retroChannel={retroChannel}
          users={users}
        />
      )

      const actionItemInput = wrapper.find("input[name='idea']")
      actionItemInput.simulate("change", { target: { value: "new action item" } })

      expect(
        retroChannel.push.calledWith("user_typing_action_item", { userToken: "xyz" })
      ).to.equal(true)
    })
  })

  describe("when the state's `assignee` value changes", () => {
    it("shifts focus to the action_item input", () => {
      wrapper = mountWithConnectedSubcomponents(
        <ActionItemSubmissionForm
          currentUser={stubUser}
          retroChannel={mockRetroChannel}
          users={users}
        />
      )

      const actionItemInput = wrapper.find("input[name='idea']")

      expect(document.activeElement).to.equal(actionItemInput.instance())
      document.activeElement.blur()
      expect(document.activeElement).not.to.equal(wrapper.find("input[name='idea']").instance())

      wrapper.setState({ assigneeId: 3 })

      expect(document.activeElement).to.equal(actionItemInput.instance())
    })
  })

  describe("at the outset the form submit is disabled", () => {
    it("is enabled once the input receives a value and an assignee is selected", () => {
      wrapper = mountWithConnectedSubcomponents(
        <ActionItemSubmissionForm
          currentUser={stubUser}
          retroChannel={mockRetroChannel}
          users={users}
        />
      )
      let submitButton = wrapper.find("button[type='submit']")
      const ideaInput = wrapper.find("input[name='idea']")

      expect(submitButton.prop("disabled")).to.equal(true)
      wrapper.setState({ assigneeId: 3 })
      ideaInput.simulate("change", { target: { value: "farts" } })
      submitButton = wrapper.find("button[type='submit']")
      expect(submitButton.prop("disabled")).to.equal(false)
    })
  })

  describe(".componentWillReceiveProps", () => {
    describe("when the `category` state attribute is stubbed with nonsense", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
          />
        )

        wrapper.setState({ category: "stub" })
      })
    })

    describe("when the form has an alert object and the alert is then removed", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <ActionItemSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            alert={{ herp: "derp" }}
            users={users}
          />
        )
      })

      it("passes the state's focus back to action item input", () => {
        const ideaInput = wrapper.find("input[name='idea']")
        expect(document.activeElement).to.equal(ideaInput.instance())
        document.activeElement.blur()
        wrapper.setProps({ alert: null })
        expect(document.activeElement).to.equal(ideaInput.instance())
      })
    })
  })

  describe("actionItemEntryStarted state", () => {
    describe("when it is true", () => {
      it("doesn't render a pointing label to prompt the user to enter an actionItem", () => {
        wrapper = mountWithConnectedSubcomponents(
          <ActionItemSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            users={users}
          />
        )
        wrapper.setState({ actionItemEntryStarted: true })
        expect(
          wrapper.find(".pointing").length
        ).to.equal(0)
      })
    })

    describe("when it is false", () => {
      context("when the stage is 'action-items'", () => {
        it("does render a pointing label to prompt the user to enter an idea", () => {
          wrapper = mountWithConnectedSubcomponents(
            <ActionItemSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              users={users}
              stage="action-items"
            />
          )
          expect(
            wrapper.find(".pointing").length
          ).to.equal(1)
        })
      })

      context("when the stage is something other than 'action-items'", () => {
        it("does not render a pointing label", () => {
          wrapper = mountWithConnectedSubcomponents(
            <ActionItemSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              stage="voting"
              users={users}
            />
          )
          expect(
            wrapper.find(".pointing").length
          ).to.equal(0)
        })
      })
    })
  })
})
