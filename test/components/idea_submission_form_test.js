import React from "react"
import sinon from "sinon"

import { IdeaSubmissionForm } from "../../web/static/js/components/idea_submission_form"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, ACTION_ITEMS } = STAGES

describe("IdeaSubmissionForm component", () => {
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
  describe("the input field for an idea", () => {
    it("contains the maxLength property with a limit of 255 characters", () => {
      const retroChannel = { on: () => { } }

      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={retroChannel}
          stage={IDEA_GENERATION}
          users={users}
        />
      )

      const ideaInput = wrapper.find("input[name='idea']")
      expect(ideaInput.props().maxLength).to.equal("255")
    })
  })

  describe("on submit", () => {
    describe("when in the IDEA_GENERATION stage", () => {
      it("pushes a `new_idea` event to the retroChannel, passing a happy idea by default", () => {
        const retroChannel = { on: () => { }, push: sinon.spy() }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={retroChannel}
            stage={IDEA_GENERATION}
            users={users}
          />
        )

        wrapper.simulate("submit", fakeEvent)

        expect(
          retroChannel.push.calledWith("new_idea", {
            category: "happy",
            body: "",
            userId: 1,
            assigneeId: null,
            ideaEntryStarted: false,
          }
        )).to.equal(true)
      })
    })

    describe("when in the ACTION_ITEMS stage", () => {
      it("pushes a `new_idea` event to the retroChannel with the action-item", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={retroChannel}
            users={users}
            stage={ACTION_ITEMS}
          />
        )

        wrapper.setState({ assigneeId: 3, body: "Some issue", ideaEntryStarted: true })

        wrapper.simulate("submit", fakeEvent)

        expect(
          retroChannel.push.calledWith("new_idea", {
            body: "Some issue",
            userId: 1,
            assigneeId: 3,
            ideaEntryStarted: true,
            category: "action-item",
          }
        )).to.equal(true)
      })
    })
  })

  describe("on change of an idea's body", () => {
    it("pushes a `user_typing_idea` event to the retro channel, along with the user token", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }
      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={retroChannel}
          users={users}
        />
      )
      const ideaInput = wrapper.find("input[name='idea']")
      ideaInput.simulate("change", { target: { value: "new value" } })

      expect(
        retroChannel.push.calledWith("user_typing_idea", { userToken: "xyz" })
      ).to.equal(true)
    })
  })

  describe("when the state's `category` value changes", () => {
    it("shifts focus to the idea input", () => {
      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={mockRetroChannel}
          users={users}
        />
      )

      const ideaInput = wrapper.find("input[name='idea']")

      expect(document.activeElement).to.equal(ideaInput.instance())
      document.activeElement.blur()
      expect(document.activeElement).not.to.equal(wrapper.find("input[name='idea']").instance())

      wrapper.setState({ category: "derp" })
      expect(document.activeElement).to.equal(ideaInput.instance())
    })
  })

  describe("at the outset the form submit is disabled", () => {
    describe("during the IDEA_GENERATION stage", () => {
      it("is enabled once the input receives a value", () => {
        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            users={users}
            stage={IDEA_GENERATION}
          />
        )
        let submitButton = wrapper.find("button[type='submit']")
        const ideaInput = wrapper.find("input[name='idea']")

        expect(submitButton.prop("disabled")).to.equal(true)
        ideaInput.simulate("change", { target: { value: "farts" } })

        submitButton = wrapper.find("button[type='submit']")
        expect(submitButton.prop("disabled")).to.equal(false)
      })
    })

    describe("during the ACTION_ITEMS stage", () => {
      it("is enabled once the input receives a value and an assignee is selected", () => {
        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            users={users}
            stage={ACTION_ITEMS}
          />
        )
        let submitButton = wrapper.find("button[type='submit']")
        const ideaInput = wrapper.find("input[name='idea']")

        expect(submitButton.prop("disabled")).to.equal(true)
        ideaInput.simulate("change", { target: { value: "farts" } })
        submitButton = wrapper.find("button[type='submit']")
        expect(submitButton.prop("disabled")).to.equal(true)
        wrapper.setState({ assigneeId: 3 })
        submitButton = wrapper.find("button[type='submit']")
        expect(submitButton.prop("disabled")).to.equal(false)
      })
    })
  })

  describe(".componentWillReceiveProps", () => {
    describe("when the `category` state attribute is stubbed with nonsense", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            users={users}
          />
        )

        wrapper.setState({ category: "stub" })
      })
    })

    describe("when the form has an alert object and the alert is then removed", () => {
      beforeEach(() => {
        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
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

  describe("ideaEntryStarted state", () => {
    describe("when it is true", () => {
      it("doesn't render a pointing label to prompt the user to enter an idea", () => {
        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            users={users}
          />
        )
        wrapper.setState({ ideaEntryStarted: true })
        expect(
          wrapper.find(".pointing").length
        ).to.equal(0)
      })
    })

    describe("when it is false", () => {
      context("when the stage is 'idea-generation'", () => {
        it("does render a pointing label to prompt the user to enter an idea", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              stage={IDEA_GENERATION}
              users={users}
            />
          )
          expect(
            wrapper.find(".pointing").length
          ).to.equal(1)
        })
      })

      context("when the stage is 'action-items'", () => {
        it("does render a pointing label to prompt the user to enter an action item", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              users={users}
              stage={ACTION_ITEMS}
            />
          )
          expect(
            wrapper.find(".pointing").length
          ).to.equal(1)
        })
      })

      context("when the stage is something other than 'idea-generation' or 'action-items'", () => {
        it("does not render a pointing label", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              stage={VOTING}
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
