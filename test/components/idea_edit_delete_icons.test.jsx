import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import IdeaEditDeleteIcons from "../../web/static/js/components/idea_edit_delete_icons"

describe("<IdeaEditDeleteIcons />", () => {
  let idea = {}
  let actions = {}
  let defaultProps
  const mockUser = { id: 1, token: "abc", is_facilitator: true }

  beforeEach(() => {
    defaultProps = {
      currentUser: mockUser,
      idea,
      actions,
    }
  })

  describe("when idea in question is in an edit state", () => {
    it("disables", () => {
      idea = { id: 666, body: "redundant tests", user_id: 1, inEditState: true }

      const wrapper = shallow(
        <IdeaEditDeleteIcons
          {...defaultProps}
          idea={idea}
        />
      )

      const removalIconQuery = wrapper.find(".disabled")
      expect(removalIconQuery.length).to.equal(1)
    })
  })

  describe("when idea in question has been submitted for deletion", () => {
    it("disables", () => {
      idea = { id: 666, body: "redundant tests", user_id: 1, deletionSubmitted: true }

      const wrapper = shallow(
        <IdeaEditDeleteIcons
          {...defaultProps}
          idea={idea}
        />
      )

      const removalIconQuery = wrapper.find(".disabled")
      expect(removalIconQuery.length).to.equal(1)
    })
  })

  describe("when idea in question isnt in editing state and hasn't been submitted for deletion", () => {
    it("is not disabled", () => {
      idea = { id: 666, body: "redundant tests", user_id: 1, inEditState: false, deletionSubmitted: false }

      const wrapper = shallow(
        <IdeaEditDeleteIcons
          {...defaultProps}
          idea={idea}
        />
      )

      const removalIconQuery = wrapper.find(".disabled")
      expect(removalIconQuery.length).to.equal(0)
    })
  })

  describe("on click of the removal icon", () => {
    context("when the user confirms the removal", () => {
      let originalConfirm

      beforeEach(() => {
        originalConfirm = window.confirm
        global.confirm = () => (true)

        actions = { submitIdeaDeletionAsync: sinon.spy() }
        idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

        const wrapper = shallow(
          <IdeaEditDeleteIcons
            {...defaultProps}
            actions={actions}
            idea={idea}
          />
        )

        const removalIcon = wrapper.find(".remove.icon")
        expect(removalIcon.prop("title")).to.equal("Delete Idea")

        removalIcon.simulate("click")
      })

      after(() => {
        global.confirm = originalConfirm
      })

      it("dispatches the submitIdeaDeletionAsync action with the idea id", () => {
        expect(actions.submitIdeaDeletionAsync).calledWith(666)
      })
    })

    context("when the user does *not* confirm the removal", () => {
      let originalConfirm

      beforeEach(() => {
        originalConfirm = window.confirm
        global.confirm = () => (false)

        actions = { submitIdeaDeletionAsync: sinon.spy() }
        idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

        const wrapper = shallow(
          <IdeaEditDeleteIcons
            {...defaultProps}
            actions={actions}
            idea={idea}
          />
        )

        const removalIcon = wrapper.find(".remove.icon")
        expect(removalIcon.prop("title")).to.equal("Delete Idea")

        removalIcon.simulate("click")
      })

      after(() => {
        global.confirm = originalConfirm
      })

      it("no deletion action is dispatched the submitIdeaDeletionAsync action with the idea id", () => {
        expect(actions.submitIdeaDeletionAsync).not.called
      })
    })
  })

  describe("on click of the edit icon", () => {
    it("dispatches the initiateIdeaEditState action with the idea id", () => {
      actions = { initiateIdeaEditState: sinon.spy() }
      idea = { id: 789, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

      const wrapper = shallow(
        <IdeaEditDeleteIcons
          {...defaultProps}
          actions={actions}
          idea={idea}
        />
      )

      const editIcon = wrapper.find(".edit.icon")
      expect(editIcon.prop("title")).to.equal("Edit Idea")

      editIcon.simulate("click")
      expect(actions.initiateIdeaEditState).calledWith(789)
    })
  })
})
