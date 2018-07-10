import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import RightFloatedIdeaActions from "../../web/static/js/components/right_floated_idea_actions"

describe("<RightFloatedIdeaActions />", () => {
  let idea
  let retroChannel = {}
  const mockUser = { id: 1, token: "abc" }

  describe("on click of the removal icon", () => {
    it("pushes an `idea_deleted` event to the retro channel, passing the given idea's id", () => {
      idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: false }
      retroChannel = { on: () => { }, push: sinon.spy() }

      const wrapper = shallow(
        <RightFloatedIdeaActions
          currentUser={mockUser}
          idea={idea}
          retroChannel={retroChannel}
        />
      )

      const removalIcon = wrapper.find(".remove.icon")
      expect(removalIcon.prop("title")).to.equal("Delete Idea")

      removalIcon.simulate("click")
      expect(
        retroChannel.push.calledWith("idea_deleted", 666)
      ).to.equal(true)
    })
  })

  describe("on click of the edit icon", () => {
    it("pushes an enable_idea_edit_state event to the channel, passing idea id and editorToken", () => {
      idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: false }
      retroChannel = { on: () => { }, push: sinon.spy() }

      const wrapper = shallow(
        <RightFloatedIdeaActions
          retroChannel={retroChannel}
          currentUser={mockUser}
          idea={idea}
        />
      )

      const editIcon = wrapper.find(".edit.icon")
      expect(editIcon.prop("title")).to.equal("Edit Idea")

      editIcon.simulate("click")
      expect(
        retroChannel.push.calledWith("enable_idea_edit_state", { id: idea.id, editorToken: mockUser.token })
      ).to.equal(true)
    })
  })


  context("when the user *is* the facilitator", () => {
    const facilitator = { id: 1, token: "abc", is_facilitator: true }

    it("renders an announcment icon", () => {
      const wrapper = shallow(
        <RightFloatedIdeaActions
          idea={{}}
          currentUser={facilitator}
          retroChannel={retroChannel}
        />
      )

      expect(wrapper.find(".announcement.icon")).to.have.length(1)
    })

    describe("on click of the announcement icon", () => {
      it("pushes a `highlight_idea` event to the retro channel, passing the given idea's id and highlight state", () => {
        retroChannel = { on: () => { }, push: sinon.spy() }
        idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: false }

        const wrapper = shallow(
          <RightFloatedIdeaActions
            currentUser={facilitator}
            idea={idea}
            retroChannel={retroChannel}
          />
        )

        wrapper.find(".announcement.icon").simulate("click")
        expect(
          retroChannel.push.calledWith("highlight_idea", { id: 666, isHighlighted: false })
        ).to.equal(true)
      })
    })

    describe("when the idea is highlighted", () => {
      it("displays a ban icon", () => {
        const highlightedIdea = Object.assign({}, idea, { isHighlighted: true })
        const wrapper = shallow(
          <RightFloatedIdeaActions
            idea={highlightedIdea}
            retroChannel={retroChannel}
            currentUser={facilitator}
          />
        )

        expect(wrapper.find(".ban.icon")).to.have.length(1)
      })

      describe("on click of the ban icon", () => {
        it("pushes a `highlight_idea` event to the retro channel, passing the given idea's id and highlight state", () => {
          retroChannel = { on: () => {}, push: sinon.spy() }

          const wrapper = shallow(
            <RightFloatedIdeaActions
              idea={{ id: 666, isHighlighted: true }}
              retroChannel={retroChannel}
              currentUser={facilitator}
            />
          )

          wrapper.find(".ban.icon").simulate("click")
          expect(
            retroChannel.push.calledWith("highlight_idea", { id: 666, isHighlighted: true })
          ).to.equal(true)
        })
      })
    })
  })

  context("when the user is *not* the facilitator", () => {
    it("doesn't render an announcement icon", () => {
      const wrapper = shallow(
        <RightFloatedIdeaActions
          idea={{ ...idea, user_id: 3 }}
          currentUser={{ ...mockUser, id: 2, is_facilitator: false }}
          retroChannel={retroChannel}
        />
      )

      expect(wrapper.find(".announcment.icon")).to.have.length(0)
    })
  })
})
