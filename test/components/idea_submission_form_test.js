import React from "react"
import { mount } from "enzyme"
import sinon from "sinon"

import IdeaSubmissionForm from "../../web/static/js/components/idea_submission_form"

describe("IdeaSubmissionForm component", () => {
  let wrapper

  const stubUser = { given_name: "Mugatu", token: "xyz", id: 1 }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const fakeEvent = {
    stopPropagation: () => undefined,
    preventDefault: () => undefined,
  }

  describe("on submit", () => {
    describe("when showActionItem is true", () => {
      it("pushes a `new_idea` event to the retro channel with the action-item", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }

        wrapper = mount(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={retroChannel}
            showActionItem
          />
        )
        wrapper.simulate("submit", fakeEvent)

        expect(
          retroChannel.push.calledWith("new_idea", {
            category: "action-item",
            body: "",
            userId: 1,
            ideaEntryStarted: false,
          }
        )).to.equal(true)
      })
    })

    describe("when showActionItem is false", () => {
      it("pushes a `new_idea` event to the retroChannel, passing a happy idea by default", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }

        wrapper = mount(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={retroChannel}
            showActionItem={false}
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
  })

  describe("on change of an idea's body", () => {
    it("pushes a `user_typing_idea` event to the retro channel, along with the user token", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      wrapper = mount(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={retroChannel}
          showActionItem
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
      wrapper = mount(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={mockRetroChannel}
          showActionItem
        />
      )

      const ideaInput = wrapper.find("input[name='idea']")

      expect(document.activeElement).to.equal(ideaInput.node)
      document.activeElement.blur()
      expect(document.activeElement).not.to.equal(wrapper.find("input[name='idea']").node)

      wrapper.setState({ category: "derp" })
      expect(document.activeElement).to.equal(ideaInput.node)
    })
  })

  describe("at the outset the form submit is disabled", () => {
    it("is enabled once the input receives a value", () => {
      wrapper = mount(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={mockRetroChannel}
          showActionItem
        />
      )
      const submitButton = wrapper.find("button[type='submit']")
      const ideaInput = wrapper.find("input[name='idea']")

      expect(submitButton.prop("disabled")).to.equal(true)
      ideaInput.simulate("change", { target: { value: "farts" } })
      expect(submitButton.prop("disabled")).to.equal(false)
    })
  })

  describe(".componentWillReceiveProps", () => {
    describe("when the `category` state attribute is stubbed with nonsense", () => {
      beforeEach(() => {
        wrapper = mount(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            showActionItem={false}
          />
        )

        wrapper.setState({ category: "stub" })
      })


      describe("passing a new `showActionItem` prop value", () => {
        it("changes the state's `category` to 'action-item'", () => {
          wrapper.setProps({ showActionItem: true })
          expect(wrapper.state("category")).to.equal("action-item")
        })
      })

      describe("passing a `showActionItem` prop value identical to the previous value", () => {
        it("does not change the state's `category` value", () => {
          wrapper.setProps({ showActionItem: false })
          expect(wrapper.state("category")).to.equal("stub")
        })
      })
    })
  })

  describe("the showActionItem prop", () => {
    it("when true results in the category list only rendering an 'action-item' option", () => {
      wrapper = mount(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={mockRetroChannel}
          showActionItem
        />
      )

      const categorySelect = wrapper.find("select")
      expect(
        categorySelect.contains(<option value="action-item">action-item</option>)
      ).to.equal(true)
    })

    it("when false results in the category list rendering options for the basic retro categories", () => {
      wrapper = mount(
        <IdeaSubmissionForm
          currentUser={stubUser}
          retroChannel={mockRetroChannel}
          showActionItem={false}
        />
      )

      const categorySelect = wrapper.find("select")

      const presumedMatches = [
        <option key="happy" value="happy">happy</option>,
        <option key="sad" value="sad">sad</option>,
        <option key="confused" value="confused">confused</option>,
      ]

      expect(
        categorySelect.contains(presumedMatches)
      ).to.equal(true)


      expect(
        categorySelect.contains(<option value="action-item">action-item</option>)
      ).to.equal(false)
    })
  })

  describe("ideaEntryStarted state", () => {
    describe("when it is true", () => {
      it("doesn't render a pointing label to prompt the user to enter an idea", () => {
        wrapper = mount(
          <IdeaSubmissionForm
            currentUser={stubUser}
            retroChannel={mockRetroChannel}
            showActionItem
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
          wrapper = mount(
            <IdeaSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              stage="idea-generation"
              showActionItem
            />
          )
          expect(
            wrapper.find(".pointing").length
          ).to.equal(1)
        })
      })

      context("when the stage is something other than 'idea-generation'", () => {
        it("does not render a pointing label", () => {
          wrapper = mount(
            <IdeaSubmissionForm
              currentUser={stubUser}
              retroChannel={mockRetroChannel}
              stage="voting"
              showActionItem
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
