import React from "react"
import sinon from "sinon"

import { IdeaSubmissionForm } from "../../web/static/js/components/idea_submission_form"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, ACTION_ITEMS } = STAGES

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
      it("pushes a `idea_submitted` event to the retroChannel, passing a happy idea by default", () => {
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
          retroChannel.push.calledWith("idea_submitted", {
            category: "happy",
            body: "",
            userId: 1,
            assigneeId: null,
            hasTypedChar: false,
          }
        )).to.equal(true)
      })
    })

    describe("when in the ACTION_ITEMS stage", () => {
      it("pushes a `idea_submitted` event, assigning the action-item to the first user by default", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={retroChannel}
            users={users}
            stage={ACTION_ITEMS}
          />
        )

        wrapper.setState({ body: "Some issue", hasTypedChar: true })

        wrapper.simulate("submit", fakeEvent)

        expect(
          retroChannel.push.calledWith("idea_submitted", {
            body: "Some issue",
            userId: 1,
            assigneeId: 1,
            hasTypedChar: true,
            category: "action-item",
          }
        )).to.equal(true)
      })
    })
  })

  describe("on change of an idea's body", () => {
    let clock

    before(() => {
      clock = sinon.useFakeTimers()
    })

    beforeEach(() => {
      // ensure we don't get false positives due to throttling of pushes
      clock.tick(1000)
    })

    after(() => {
      clock.restore()
    })

    describe("when the event isTrusted", () => {
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
        ideaInput.simulate("change", {
          isTrusted: true,
          target: { value: "new value" },
        })

        expect(
          retroChannel.push.calledWith("user_typing_idea", { userToken: "xyz" })
        ).to.equal(true)
      })
    })

    describe("when the event's isTrusted value is false", () => {
      it("does *not* push a `user_typing_idea` event to the retro channel", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }
        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={retroChannel}
            users={users}
          />
        )
        const ideaInput = wrapper.find("input[name='idea']")
        ideaInput.simulate("change", {
          isTrusted: false,
          target: { value: "new value" },
        })

        expect(
          retroChannel.push.called
        ).to.equal(false)
      })
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
    it("is enabled once the input receives a non-whitespace value", () => {
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

      ideaInput.simulate("change", {
        target: { value: " " },
        isTrusted: true,
      })
      submitButton = wrapper.find("button[type='submit']")
      expect(submitButton.prop("disabled")).to.equal(true)

      ideaInput.simulate("change", {
        target: { value: "farts" },
        isTrusted: true,
      })
      submitButton = wrapper.find("button[type='submit']")
      expect(submitButton.prop("disabled")).to.equal(false)
    })
  })

  describe(".componentWillReceiveProps", () => {
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

  describe("hasTypedChar state", () => {
    context("when the stage is 'idea-generation'", () => {
      context("and the value is true", () => {
        it("does not render a pointing label", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              stage={IDEA_GENERATION}
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              users={users}
            />
          )
          wrapper.setState({ hasTypedChar: true })
          expect(
            wrapper.find(".pointing").length
          ).to.equal(0)
        })
      })

      context("and the value is false", () => {
        it("renders a pointing label to prompt the user to enter an idea", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              stage={IDEA_GENERATION}
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              users={users}
            />
          )
          wrapper.setState({ hasTypedChar: false })

          expect(
            wrapper.find(".pointing").length
          ).to.equal(1)
        })
      })
    })

    describe("when the stage is action items", () => {
      context("and the hasTypedChar value is false", () => {
        // we don't want to prompt users to just submit action items willy-nilly
        // they should be discussed and generated thoughtfully
        it("does not render a pointing label to prompt the user to enter an idea", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              stage={ACTION_ITEMS}
              users={users}
            />
          )

          wrapper.setState({ hasTypedChar: false })

          expect(
            wrapper.find(".pointing").length
          ).to.equal(0)
        })
      })
    })
  })
})
