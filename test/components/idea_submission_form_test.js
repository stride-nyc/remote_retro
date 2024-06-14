import React from "react"
import sinon from "sinon"

import { IdeaSubmissionForm } from "../../web/static/js/components/idea_submission_form"

describe("IdeaSubmissionForm component", () => {
  let wrapper

  const stubUser = { given_name: "Mugatu", token: "xyz", id: 1 }
  const mockActions = { broadcastIdeaTypingEvent: () => {} }
  const fakeEvent = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined,
  }
  const users = [
    { id: 1, name: "Tina Fey" },
    { id: 2, name: "Betty White" },
    { id: 3, name: "Bill Smith" },
  ]

  const defaultProps = {
    currentUser: stubUser,
    actions: mockActions,
    ideaGenerationCategories: ["happy", "sad", "confused"],
    isAnActionItemsStage: true,
    users,
  }

  beforeEach(() => {
    window.scrollTo = sinon.spy()
  })

  describe("the input field for an idea", () => {
    it("contains the maxLength property with a limit of 255 characters", () => {
      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm {...defaultProps} />
      )

      const ideaInput = wrapper.find("input[name='idea']")
      expect(ideaInput.props().maxLength).to.equal("255")
    })

    context("when the user is on a mobile device", () => {
      beforeEach(() => {
        global.navigator = {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
        }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm {...defaultProps} />
        )
      })

      it("renders without autofocus to avoid an unwanted zoom", () => {
        const ideaInput = wrapper.find("input[name='idea']")
        expect(ideaInput.props().autoFocus).to.equal(false)
      })
    })

    context("when the user is *not* on a mobile device", () => {
      beforeEach(() => {
        global.navigator = {
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
        }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm {...defaultProps} />
        )
      })

      it("renders autofocused", () => {
        const ideaInput = wrapper.find("input[name='idea']")
        expect(ideaInput.props().autoFocus).to.equal(true)
      })
    })
  })

  describe("on submit", () => {
    describe("when in a non-action-items stage", () => {
      it("invokes submitIdea, passing an idea w/ category of the first category by default", () => {
        const actions = { submitIdea: sinon.spy() }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            {...defaultProps}
            isAnActionItemsStage={false}
            actions={actions}
          />
        )

        wrapper.simulate("submit", fakeEvent)

        expect(actions.submitIdea).calledWithMatch({
          category: "happy",
          body: "",
          userId: 1,
          assigneeId: null,
        })
      })
    })

    describe("when in an action items stage", () => {
      it("invokes the submitIdea action with an 'action-item' category", () => {
        const actions = { submitIdea: sinon.spy() }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            {...defaultProps}
            actions={actions}
            isAnActionItemsStage
          />
        )

        wrapper.setState({ body: "Some issue", hasTypedChar: true })

        wrapper.simulate("submit", fakeEvent)

        expect(actions.submitIdea).calledWithMatch({
          body: "Some issue",
          userId: 1,
          assigneeId: 1,
          category: "action-item",
        })
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
      it("invokes the broadcastIdeaTypingEvent action, passing the user token", () => {
        const actions = { broadcastIdeaTypingEvent: sinon.spy() }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            {...defaultProps}
            actions={actions}
          />
        )
        const ideaInput = wrapper.find("input[name='idea']")
        ideaInput.simulate("change", {
          isTrusted: true,
          target: { value: "new value" },
        })

        expect(actions.broadcastIdeaTypingEvent).calledWith({ userToken: "xyz" })
      })
    })

    describe("when the event's isTrusted value is false", () => {
      it("does *not* invoke the broadcastIdeaTypingEvent action", () => {
        const actions = { broadcastIdeaTypingEvent: sinon.spy() }

        wrapper = mountWithConnectedSubcomponents(
          <IdeaSubmissionForm
            {...defaultProps}
            actions={actions}
          />
        )
        const ideaInput = wrapper.find("input[name='idea']")
        ideaInput.simulate("change", {
          isTrusted: false,
          target: { value: "new value" },
        })

        expect(actions.broadcastIdeaTypingEvent).not.called
      })
    })
  })

  describe("when the state's `category` value changes", () => {
    it("shifts focus to the idea input", () => {
      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm {...defaultProps} />
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
          {...defaultProps}
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
            {...defaultProps}
            currentUser={stubUser}
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

  describe("on mount", () => {
    beforeEach(() => {
      wrapper = mountWithConnectedSubcomponents(
        <IdeaSubmissionForm
          {...defaultProps}
          currentUser={stubUser}
          alert={{ herp: "derp" }}
          users={users}
        />
      )
    })

    it("ensures the window is scrolled to the top to avoid a safari autofocus render shift", () => {
      expect(window.scrollTo).to.have.been.calledWith(0, 0)
    })
  })

  describe("hasTypedChar state", () => {
    context("when in a non-action-items stage'", () => {
      context("and the value is true", () => {
        it("does not render a pointing label", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              {...defaultProps}
              isAnActionItemsStage={false}
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
              {...defaultProps}
              isAnActionItemsStage={false}
            />
          )
          wrapper.setState({ hasTypedChar: false })

          expect(
            wrapper.find(".pointing").length
          ).to.equal(1)
        })
      })
    })

    describe("when in an action items stage", () => {
      context("and the hasTypedChar value is false", () => {
        // we don't want to prompt users to just submit action items willy-nilly
        // they should be discussed and generated thoughtfully
        it("does not render a pointing label to prompt the user to enter an idea", () => {
          wrapper = mountWithConnectedSubcomponents(
            <IdeaSubmissionForm
              {...defaultProps}
              isAnActionItemsStage
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
