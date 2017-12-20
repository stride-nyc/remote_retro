import React from "react"
import sinon from "sinon"

import { IdeaSubmissionForm } from "../../web/static/js/components/idea_submission_form"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING } = STAGES

describe("IdeaSubmissionForm component", () => {
  let wrapper

  const stubUser = { given_name: "Mugatu", token: "xyz", id: 1 }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const fakeEvent = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined,
  }

  describe("on submit", () => {
    it("pushes a `new_idea` event to the retroChannel, passing a happy idea by default", () => {
      const retroChannel = { on: () => { }, push: sinon.spy() }

      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={retroChannel}
        />
      )

      wrapper.simulate("submit", fakeEvent)

      expect(
        retroChannel.push.calledWith("new_idea", {
          category: "happy",
          body: "",
          userId: 1,
          ideaEntryStarted: false,
        }
      )).to.equal(true)
    })
  })

  describe("on change of an idea's body", () => {
    it("pushes a `user_typing_idea` event to the retro channel, along with the user token", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }
      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={retroChannel}
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
    it("is enabled once the input receives a value", () => {
      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={mockRetroChannel}
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
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            alert={{ herp: "derp" }}
          />
        )
      })

      it("passes the state's `category` to 'action-item'", () => {
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
            />
          )
          expect(
            wrapper.find(".pointing").length
          ).to.equal(1)
        })
      })

      context("when the stage is something other than 'idea-generation'", () => {
        it("does not render a pointing label", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              stage={VOTING}
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
