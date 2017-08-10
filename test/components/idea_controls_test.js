import React from "react"
import { shallow } from "enzyme"
import sinon from "sinon"

import IdeaControls from "../../web/static/js/components/idea_controls"
import VoteCounter from "../../web/static/js/components/vote_counter"

describe("<IdeaControls />", () => {
  const idea = { id: 666, category: "sad", body: "redundant tests", user_id: 1 }
  const mockUser = { id: 2, is_facilitator: true }
  const ideaGenerationStage = "idea-generation"
  const votingStage = "voting"

  describe("on click of the removal icon", () => {
    it("pushes an `delete_idea` event to the retro channel, passing the given idea's id", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = shallow(
        <IdeaControls
          idea={idea}
          retroChannel={retroChannel}
          currentUser={mockUser}
          stage={ideaGenerationStage}
        />
      )

      wrapper.find(".remove.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("delete_idea", 666)
      ).to.equal(true)
    })
  })

  describe("on click of the edit icon", () => {
    it("pushes an `enable_edit_state` event to the retro channel, passing the given idea", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = shallow(
        <IdeaControls
          idea={idea}
          retroChannel={retroChannel}
          currentUser={mockUser}
          stage={ideaGenerationStage}
        />
      )

      wrapper.find(".edit.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("enable_edit_state", idea)
      ).to.equal(true)
    })
  })

  describe("on click of the announcement icon", () => {
    it("pushes a `highlight_idea` event to the retro channel, passing the given idea's id and highlight state", () => {
      const retroChannel = { on: () => {}, push: sinon.spy() }

      const wrapper = shallow(
        <IdeaControls
          idea={idea}
          retroChannel={retroChannel}
          currentUser={mockUser}
          stage={ideaGenerationStage}
        />
      )

      wrapper.find(".announcement.icon").simulate("click")
      expect(
        retroChannel.push.calledWith("highlight_idea", { id: 666, isHighlighted: false })
      ).to.equal(true)
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
          stage={ideaGenerationStage}
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
            stage={ideaGenerationStage}
          />
        )

        expect(wrapper.find(".remove.icon")).to.have.length(1)
      })
    })

    context("when the user is not the facilitator", () => {
      let clock
      let earlierDate

      context("and the idea is not theirs", () => {
        it("doesn't render", () => {
          const retroChannel = { on: () => {}, push: sinon.spy() }
          const currentUser = { id: 2, is_facilitator: false }

          const wrapper = shallow(
            <IdeaControls
              idea={idea}
              retroChannel={retroChannel}
              currentUser={currentUser}
              stage={ideaGenerationStage}
            />
          )

          expect(wrapper.find(".remove.icon")).to.have.length(0)
        })
      })

      context("and the idea is theirs", () => {
        beforeEach(() => {
          clock = sinon.useFakeTimers(new Date(2017, 1, 1, 0, 0, 0).getTime())
        })

        afterEach(() => {
          clock.restore()
        })

        context("and the idea was inserted into the db less than 5 seconds ago", () => {
          it("renders", () => {
            earlierDate = new Date(clock.now - 4000)
            const retroChannel = { on: () => {}, push: sinon.spy() }
            const currentUser = { id: 1, is_facilitator: false }
            const freshIdea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, inserted_at: earlierDate.toUTCString() }

            const wrapper = shallow(
              <IdeaControls
                idea={freshIdea}
                retroChannel={retroChannel}
                currentUser={currentUser}
                stage={ideaGenerationStage}
              />
            )

            expect(wrapper.find(".remove.icon")).to.have.length(1)
          })
        })

        context("and the idea was inserted into the db more than 5 seconds ago", () => {
          it("doesn't render", () => {
            earlierDate = new Date(clock.now - 6000)
            const retroChannel = { on: () => {}, push: sinon.spy() }
            const currentUser = { id: 1, is_facilitator: false }
            const staleIdea = { id: 666, category: "sad", body: "redundant tests", user_id: 1, inserted_at: earlierDate.toUTCString() }

            const wrapper = shallow(
              <IdeaControls
                idea={staleIdea}
                retroChannel={retroChannel}
                currentUser={currentUser}
                stage={ideaGenerationStage}
              />
            )

            expect(wrapper.find(".remove.icon")).to.have.length(0)
          })
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
              stage={votingStage}
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
              stage={votingStage}
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
        const actionItemIdea = { id: 667, category: "action-item", body: "write tests", user_id: 1 }

        const wrapper = shallow(
          <IdeaControls
            idea={idea}
            retroChannel={retroChannel}
            currentUser={currentUser}
            stage={ideaGenerationStage}
          />
         )

        expect(wrapper.find(VoteCounter)).to.have.length(0)
      })
    })
  })
})
