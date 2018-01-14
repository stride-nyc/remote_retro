import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import IdeaEditForm from "../../web/static/js/components/idea_edit_form"

describe("<IdeaEditForm />", () => {
  const idea = { id: 999, body: "redundant tests", userId: 1 }
  const stage = "idea-generation"
  const currentUser = { is_facilitator: true }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const defaultProps = {
    idea,
    currentUser,
    retroChannel: mockRetroChannel,
    stage,
  }

  describe("on initial render", () => {
    it("is pre-populated with the given idea's body text", () => {
      const wrapper = shallow(<IdeaEditForm {...defaultProps} />)

      const textAreaValue = wrapper.find("textarea").props().value
      expect(textAreaValue).to.equal("redundant tests")
    })

    context("the textarea field for an idea", () => {
      it("contains the maxLength property with a limit of 255 characters", () => {
        const retroChannel = { on: () => { } }
        const wrapper = shallow(
          <IdeaEditForm {...defaultProps} retroChannel={retroChannel} />
        )
        const textarea = wrapper.find("textarea")
        expect(textarea.props().maxLength).to.equal("255")
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
      textarea.simulate("change", { target: { name: "editable_idea", value: "some value" } })
    })

    it("the value prop of the textarea updates in turn", () => {
      textarea = wrapper.find("textarea")
      expect(textarea.props().value).to.equal("some value")
    })

    context("when the currentUser is the facilitator", () => {
      it("pushes a `idea_live_edit` event to the retroChannel, passing current input value", () => {
        expect(
          retroChannel.push.calledWith("idea_live_edit", { id: idea.id, liveEditText: "some value" })
        ).to.equal(true)
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
          retroChannel.push.called
        ).to.equal(false)
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
          <IdeaEditForm {...defaultProps} stage={"action-items"} retroChannel={retroChannel} />
        )
      })

      it("the category dropdown is not visible", () => {
        expect(wrapper.find("select").exists()).to.equal(false)
      })
    })

    context("when the stage is not 'action-items'", () => {
      beforeEach(() => {
        retroChannel = { on: () => { }, push: sinon.spy() }
        wrapper = mountWithConnectedSubcomponents(
          <IdeaEditForm {...defaultProps} stage={"voting"} retroChannel={retroChannel} />
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
    it("pushes an `idea_edited` event to the given retroChannel", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} retroChannel={retroChannel} />
      )
      const saveButton = wrapper.find("button[type='submit']")

      saveButton.simulate("submit")

      expect(
        retroChannel.push.calledWith("idea_edited", {
          id: idea.id,
          body: idea.body,
          category: idea.category,
        })
      ).to.equal(true)
    })
  })

  describe("on cancelling out of the edit form", () => {
    it("pushes a `disable_edit_state` event to the given retroChannel", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = mountWithConnectedSubcomponents(
        <IdeaEditForm {...defaultProps} retroChannel={retroChannel} />
      )
      const cancelButton = wrapper.find("button.cancel.button")

      cancelButton.simulate("click")

      expect(
        retroChannel.push.calledWith("disable_edit_state", { id: idea.id })
      ).to.equal(true)
    })
  })
})
