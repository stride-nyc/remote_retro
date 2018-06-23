import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import { IdeaControls } from "../../web/static/js/components/idea_controls"
import VoteCounter from "../../web/static/js/components/vote_counter"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, ACTION_ITEMS, CLOSED } = STAGES

describe("<IdeaControls />", () => {
  const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1 }
  const mockUser = { id: 2, is_facilitator: true }

  context("when the stage is closed", () => {
    const wrapper = shallow(
      <IdeaControls
        idea={idea}
        retroChannel={{}}
        currentUser={mockUser}
        stage={CLOSED}
      />
    )

    it("doesn't render", () => {
      expect(wrapper.html()).to.equal(null)
    })
  })

  describe("on click of the removal icon", () => {
    context("when the idea is not currently being edited by its author", () => {
      it("pushes an `delete_idea` event to the retro channel, passing the given idea's id", () => {
        const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: false }
        const retroChannel = { on: () => { }, push: sinon.spy() }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={mockUser}
            stage={IDEA_GENERATION}
          />
        )

        const removalIcon = wrapper.find(".remove.icon")
        expect(removalIcon.prop("title")).to.equal("Delete Idea")

        removalIcon.simulate("click")
        expect(
          retroChannel.push.calledWith("delete_idea", 666)
        ).to.equal(true)
      })
    })

    context("when the idea is currently being edited by its author", () => {
      it("performs no action while displaying 'Author currently editing' on hover", () => {
        const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: true }
        const retroChannel = { on: () => { }, push: sinon.spy() }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={mockUser}
            stage={IDEA_GENERATION}
          />
        )

        const removalIcon = wrapper.find(".remove.icon")
        expect(removalIcon.prop("title")).to.equal("Author currently editing")

        removalIcon.simulate("click")
        expect(
          retroChannel.push.calledWith("delete_idea", 666)
        ).to.equal(false)
      })
    })
  })

  describe("on click of the edit icon", () => {
    context("when the idea is not currently being edited by its author", () => {
      it("pushes an enable_idea_edit_state event to the channel, passing idea id and editorToken", () => {
        const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: false }
        const retroChannel = { on: () => { }, push: sinon.spy() }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={mockUser}
            stage={IDEA_GENERATION}
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

    context("when the idea is currently being edited by its author", () => {
      it("performs no action while displaying 'Author currently editing' on hover", () => {
        const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: true }
        const retroChannel = { on: () => { }, push: sinon.spy() }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={mockUser}
            stage={IDEA_GENERATION}
          />
        )

        const editIcon = wrapper.find(".edit.icon")
        expect(editIcon.prop("title")).to.equal("Author currently editing")

        editIcon.simulate("click")
        expect(
          retroChannel.push.calledWith("enable_idea_edit_state", { idea, editorToken: mockUser.token })
        ).to.equal(false)
      })
    })
  })

  describe("on click of the announcement icon", () => {
    context("when the idea is not currently being edited by its author", () => {
      it("pushes a `highlight_idea` event to the retro channel, passing the given idea's id and highlight state", () => {
        const retroChannel = { on: () => { }, push: sinon.spy() }
        const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: false }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={mockUser}
            stage={IDEA_GENERATION}
          />
        )

        wrapper.find(".announcement.icon").simulate("click")
        expect(
          retroChannel.push.calledWith("highlight_idea", { id: 666, isHighlighted: false })
        ).to.equal(true)
      })
    })

    context("when the idea is currently being edited by its author", () => {
      it("pushes a `highlight_idea` event to the retro channel, passing the given idea's id and highlight state", () => {
        const retroChannel = { on: () => { }, push: sinon.spy() }
        const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, editing: true }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={mockUser}
            stage={IDEA_GENERATION}
          />
        )

        wrapper.find(".announcement.icon").simulate("click")
        expect(
          retroChannel.push.calledWith("highlight_idea", { id: 666, isHighlighted: false })
        ).to.equal(false)
      })
    })
  })

  describe("on click of the ban icon", () => {
    it("pushes a `highlight_idea` event to the retro channel, passing the given idea's id and highlight state", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }
      const highlightedIdea = Object.assign({}, idea, { isHighlighted: true })

      const wrapper = shallow(
        <IdeaControls
          idea={highlightedIdea}
          retroChannel={retroChannel}
          currentUser={mockUser}
          stage={IDEA_GENERATION}
        />
      )

      wrapper.find(".ban.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("highlight_idea", { id: 666, isHighlighted: true })
      ).to.equal(true)
    })
  })

  describe("the delete icon", () => {
    context("when the user is the facilitator", () => {
      it("renders", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={mockUser}
            stage={IDEA_GENERATION}
          />
        )

        expect(wrapper.find(".remove.icon")).to.have.length(1)
      })
    })

    context("when the user is not the facilitator", () => {
      context("and the idea is not theirs", () => {
        it("doesn't render any icons", () => {
          const retroChannel = { on: () => {}, push: sinon.spy() }
          const currentUser = { id: 2, is_facilitator: false }

          const wrapper = shallow(
            <IdeaControls
              idea={idea}
              retroChannel={retroChannel}
              currentUser={currentUser}
              stage={IDEA_GENERATION}
            />
          )

          expect(wrapper.find(".icon")).to.have.length(0)
        })
      })

      context("and the idea is theirs", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }
        const currentUser = { id: 1, is_facilitator: false }
        const freshIdea = { id: 666, category: "sad", body: "redundant tests", user_id: 1 }

        const wrapper = shallow(
          <IdeaControls
            idea={freshIdea}
            retroChannel={retroChannel}
            currentUser={currentUser}
            stage={IDEA_GENERATION}
          />
        )

        it("renders icons for editing and deleting", () => {
          expect(wrapper.find(".remove.icon")).to.have.length(1)
          expect(wrapper.find(".edit.icon")).to.have.length(1)
        })

        it("does *not* render an icon for highlighting", () => {
          expect(wrapper.find(".announcement.icon")).to.have.length(0)
          expect(wrapper.find(".ban.icon")).to.have.length(0)
        })
      })
    })
  })

  describe("the vote button", () => {
    context("when the stage is not idea-generation", () => {
      context("and the category is not action-item", () => {
        it("renders", () => {
          const retroChannel = { on: () => {}, push: sinon.spy() }
          const currentUser = { id: 1, is_facilitator: false }

          const wrapper = shallow(
            <IdeaControls
              idea={idea}
              retroChannel={retroChannel}
              currentUser={currentUser}
              stage={VOTING}
            />
          )

          expect(wrapper.find(VoteCounter)).to.have.length(1)
        })
      })

      context("and the category is action-item", () => {
        it("doesn't render", () => {
          const retroChannel = { on: () => {}, push: sinon.spy() }
          const currentUser = { id: 1, is_facilitator: false }
          const actionItemIdea = { id: 667, category: "action-item", body: "write tests", user_id: 1 }

          const wrapper = shallow(
            <IdeaControls
              idea={actionItemIdea}
              retroChannel={retroChannel}
              currentUser={currentUser}
              stage={VOTING}
            />
          )

          expect(wrapper.find(VoteCounter)).to.have.length(0)
        })
      })
    })

    context("when the stage is idea-generation", () => {
      it("doesn't render", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }
        const currentUser = { id: 1, is_facilitator: false }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={currentUser}
            stage={IDEA_GENERATION}
          />
         )

        expect(wrapper.find(VoteCounter)).to.have.length(0)
      })
    })

    context("after entering action-items stage", () => {
      it("renders a disabled VoteCounter for display purposes", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }
        const currentUser = { id: 1, is_facilitator: false }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={currentUser}
            stage={ACTION_ITEMS}
          />
         )

        expect(wrapper.find(VoteCounter).prop("buttonDisabled")).to.be.true
      })
    })

    context("when the currentUser has voted 5 times", () => {
      it("renders a disabled VoteCounter for the currentUser", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }
        const currentUser = { id: 1, is_facilitator: false }
        const voteForUser = { user_id: 1 }
        const votes = [voteForUser, voteForUser, voteForUser, voteForUser, voteForUser]

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            votes={votes}
            retroChannel={retroChannel}
            currentUser={currentUser}
            stage={VOTING}
          />
         )

        expect(wrapper.find(VoteCounter).prop("buttonDisabled")).to.be.true
      })
    })

    context("when the currentUser has voted under 5 times", () => {
      it("renders an enabled VoteCounter for the currentUser", () => {
        const retroChannel = { on: () => {}, push: sinon.spy() }
        const currentUser = { id: 1, is_facilitator: false }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={currentUser}
            stage={VOTING}
          />
        )

        expect(wrapper.find(VoteCounter).prop("buttonDisabled")).to.be.false
      })
    })
  })
})
