import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import RightFloatedIdeaActions from "../../web/static/js/components/right_floated_idea_actions"

describe("<RightFloatedIdeaActions />", () => {
  let idea
  let retroChannel = {}
  let actions = {}
  const mockUser = { id: 1, token: "abc" }

  describe("when idea in question is in an edit state", () => {
    it("disables", () => {
      idea = { id: 666, body: "redundant tests", user_id: 1, inEditState: true }

      const wrapper = shallow(
        <RightFloatedIdeaActions
          actions={actions}
          currentUser={mockUser}
          idea={idea}
          retroChannel={retroChannel}
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
        <RightFloatedIdeaActions
          actions={actions}
          currentUser={mockUser}
          idea={idea}
          retroChannel={retroChannel}
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
        <RightFloatedIdeaActions
          actions={actions}
          currentUser={mockUser}
          idea={idea}
          retroChannel={retroChannel}
        />
      )

      const removalIconQuery = wrapper.find(".disabled")
      expect(removalIconQuery.length).to.equal(0)
    })
  })

  describe("on click of the removal icon", () => {
    it("dispatches the submitIdeaDeletionAsync action with the idea id", () => {
      actions = { submitIdeaDeletionAsync: sinon.spy() }
      idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

      const wrapper = shallow(
        <RightFloatedIdeaActions
          actions={actions}
          currentUser={mockUser}
          idea={idea}
          retroChannel={retroChannel}
        />
      )

      const removalIcon = wrapper.find(".remove.icon")
      expect(removalIcon.prop("title")).to.equal("Delete Idea")

      removalIcon.simulate("click")
      expect(actions.submitIdeaDeletionAsync).calledWith(666)
    })
  })

  describe("on click of the edit icon", () => {
    it("dispatches the initiateIdeaEditState action with the idea id", () => {
      actions = { initiateIdeaEditState: sinon.spy() }
      idea = { id: 789, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

      const wrapper = shallow(
        <RightFloatedIdeaActions
          actions={actions}
          retroChannel={retroChannel}
          currentUser={mockUser}
          idea={idea}
        />
      )

      const editIcon = wrapper.find(".edit.icon")
      expect(editIcon.prop("title")).to.equal("Edit Idea")

      editIcon.simulate("click")
      expect(actions.initiateIdeaEditState).calledWith(789)
    })
  })


  context("when the user *is* the facilitator", () => {
    const facilitator = { id: 1, token: "abc", is_facilitator: true }

    it("renders an announcment icon", () => {
      const wrapper = shallow(
        <RightFloatedIdeaActions
          actions={actions}
          idea={{}}
          currentUser={facilitator}
          retroChannel={retroChannel}
        />
      )

      expect(wrapper.find(".announcement.icon")).to.have.length(1)
    })

    describe("on click of the announcement icon", () => {
      it("pushes a `idea_highlight_toggled` event to the retro channel, passing the given idea's id and highlight state", () => {
        retroChannel = { on: () => { }, push: sinon.spy() }
        idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, inEditState: false }

        const wrapper = shallow(
          <RightFloatedIdeaActions
            actions={actions}
            currentUser={facilitator}
            idea={idea}
            retroChannel={retroChannel}
          />
        )

        wrapper.find(".announcement.icon").simulate("click")
        expect(retroChannel.push).calledWith("idea_highlight_toggled", { id: 666, isHighlighted: false })
      })
    })

    describe("when the idea is highlighted", () => {
      it("displays a ban icon", () => {
        const highlightedIdea = Object.assign({}, idea, { isHighlighted: true })
        const wrapper = shallow(
          <RightFloatedIdeaActions
            actions={actions}
            idea={highlightedIdea}
            retroChannel={retroChannel}
            currentUser={facilitator}
          />
        )

        expect(wrapper.find(".ban.icon")).to.have.length(1)
      })

      describe("on click of the ban icon", () => {
        it("pushes a `idea_highlight_toggled` event to the retro channel, passing the given idea's id and highlight state", () => {
          retroChannel = { on: () => {}, push: sinon.spy() }

          const wrapper = shallow(
            <RightFloatedIdeaActions
              actions={actions}
              idea={{ id: 666, isHighlighted: true }}
              retroChannel={retroChannel}
              currentUser={facilitator}
            />
          )

          wrapper.find(".ban.icon").simulate("click")
          expect(retroChannel.push).calledWith("idea_highlight_toggled", { id: 666, isHighlighted: true })
        })
      })
    })
  })

  context("when the user is *not* the facilitator", () => {
    it("doesn't render an announcement icon", () => {
      const wrapper = shallow(
        <RightFloatedIdeaActions
          actions={actions}
          idea={{ ...idea, user_id: 3 }}
          currentUser={{ ...mockUser, id: 2, is_facilitator: false }}
          retroChannel={retroChannel}
        />
      )

      expect(wrapper.find(".announcment.icon")).to.have.length(0)
    })
  })
})
