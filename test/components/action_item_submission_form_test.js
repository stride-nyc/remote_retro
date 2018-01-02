import React from "react"
import sinon from "sinon"

// import { ActionItemSubmissionForm } from
  // "../../web/static/js/components/action_item_submission_form"

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

  describe(".componentWillReceiveProps", () => {
    describe("when the `category` state attribute is stubbed with nonsense", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <ActionItemSubmissionForm
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
