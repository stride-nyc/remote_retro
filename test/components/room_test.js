import React from "react"
import { shallow, mount } from "enzyme"
import { expect } from "chai"
import { spy } from "sinon"

import Room from "../../web/static/js/components/room"
import CategoryColumn from "../../web/static/js/components/category_column"
import RetroChannel from "../../web/static/js/services/retro_channel"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("Room component", () => {
  const mockRetroChannel = { push: spy(), on: () => {} }
  const stubbedPresence = { user: { given_name: "Mugatu" } }

  context("when the current user is facilitator", () => {
    context("and showActionItems is false", () => {
      it("renders the <StageProgressionButton>", () => {
        const roomComponent = shallow(
          <Room
            currentPresence={stubbedPresence}
            retroChannel={mockRetroChannel}
            isFacilitator
            users={[]}
          />
        )

        expect(roomComponent.find(StageProgressionButton)).to.have.length(1)
      })
    })
  })

  context("when the current user is not facilitator", () => {
    it("does not render <StageProgressionButton>", () => {
      const roomComponent = shallow(
        <Room
          currentPresence={stubbedPresence}
          retroChannel={mockRetroChannel}
          users={[]}
        />
      )

      expect(roomComponent.find(StageProgressionButton)).to.have.length(0)
    })
  })

  describe("Action item column", () => {
    it("is not visible on render", () => {
      const roomComponent = shallow(
        <Room currentPresence={stubbedPresence} retroChannel={mockRetroChannel} users={[]} />
      )

      expect(roomComponent.containsMatchingElement(
        <CategoryColumn category="action-item" ideas={[]} retroChannel={mockRetroChannel} />
      )).to.equal(false)
    })

    it("becomes visible when stage is 'action-items'", () => {
      const roomComponent = shallow(
        <Room currentPresence={stubbedPresence} retroChannel={mockRetroChannel} users={[]} />
      )
      roomComponent.setState({ stage: "action-items" })

      expect(roomComponent.containsMatchingElement(
        <CategoryColumn category="action-item" ideas={[]} retroChannel={mockRetroChannel} />
      )).to.equal(true)
    })
  })

  describe("RetroChannel Events", () => {
    let retroChannel
    let roomComponent

    beforeEach(() => {
      retroChannel = RetroChannel.configure({})
      roomComponent = mount(
        <Room currentPresence={stubbedPresence} retroChannel={retroChannel} users={[]} />
      )
    })

    describe("on `existing_ideas`", () => {
      it("sets the associated payload's `ideas` value on state", () => {
        expect(roomComponent.state("ideas")).to.eql([])

        const mockPayloadFromServer = { ideas: [{ arbitrary: "content" }] }
        retroChannel.trigger("existing_ideas", mockPayloadFromServer)

        expect(roomComponent.state("ideas")).to.eql([
          { arbitrary: "content" },
        ])
      })
    })

    describe("on `new_idea_received`", () => {
      it("pushes the value passed in the payload into the `ideas` array", () => {
        roomComponent.setState({ ideas: [{ body: "first idear" }] })

        retroChannel.trigger("new_idea_received", { body: "zerp" })

        expect(roomComponent.state("ideas")).to.eql([
          { body: "first idear" },
          { body: "zerp" },
        ])
      })
    })

    describe("on `proceed_to_next_stage`", () => {
      it("updates the state's `stage` attribute to the value from proceed_to_next_stage", () => {
        expect(roomComponent.state("stage")).to.equal("idea-generation")
        retroChannel.trigger("proceed_to_next_stage", { stage: "dummy value" })

        expect(roomComponent.state("stage")).to.equal("dummy value")
      })
    })

    describe("on `enable_edit_state`", () => {
      it("updates the idea with matching id, setting `editing` to true", () => {
        const ideas = [
          { id: 1 },
          { id: 2 },
          { id: 3 },
        ]

        roomComponent.setState({ ideas })

        retroChannel.trigger("enable_edit_state", { id: 2 })

        expect(roomComponent.state("ideas")[1]).to.eql({ id: 2, editing: true })
      })
    })

    describe("on `disable_edit_state`", () => {
      let ideas
      let ideaWithMatchingId

      beforeEach(() => {
        ideas = [
          { id: 1 },
          { id: 2 },
          { id: 3 },
        ]

        roomComponent.setState({ ideas })
        retroChannel.trigger("disable_edit_state", { id: 3 })
        ideaWithMatchingId = roomComponent.state("ideas").find(idea => idea.id === 3)
      })

      it("updates the idea with matching id, setting `editing` to false", () => {
        expect(ideaWithMatchingId.editing).to.equal(false)
      })

      it("updates the idea with matching id, setting `liveEditText` to null", () => {
        expect(ideaWithMatchingId.liveEditText).to.equal(null)
      })
    })

    describe("on `idea_live_edit`", () => {
      let ideas
      let ideaWithMatchingId

      beforeEach(() => {
        ideas = [
          { id: 1 },
          { id: 2 },
          { id: 3 },
        ]

        roomComponent.setState({ ideas })
        retroChannel.trigger("idea_live_edit", { id: 2, liveEditText: "lalala" })
        ideaWithMatchingId = roomComponent.state("ideas").find(idea => idea.id === 2)
      })

      it("updates the idea with matching id, setting `liveEditText` to the payload value", () => {
        expect(ideaWithMatchingId.liveEditText).to.equal("lalala")
      })
    })

    describe("on `idea_deleted`", () => {
      it("removes the idea passed in the payload from state.ideas", () => {
        roomComponent.setState({ ideas: [{ id: 6, body: "turtles" }] })
        retroChannel.trigger("idea_deleted", { id: 6 })

        expect(roomComponent.state("ideas")).to.eql([])
      })
    })

    describe("on `idea_edited`", () => {
      let ideas
      let editedIdea

      beforeEach(() => {
        ideas = [
          { id: 1 },
          { id: 2, body: "i like turtles", editing: true },
          { id: 3 },
        ]

        roomComponent.setState({ ideas })
        retroChannel.trigger("idea_edited", { id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES" })
        editedIdea = roomComponent.state("ideas").find(idea => (idea.id === 2))
      })

      it("updates the idea with matching id on state", () => {
        expect(editedIdea.body).to.eql("i like TEENAGE MUTANT NINJA TURTLES")
      })

      it("sets the idea's `editing` value to false", () => {
        expect(editedIdea.editing).to.eql(false)
      })

      it("sets the idea's `liveEditText` value to null", () => {
        expect(editedIdea.liveEditText).to.equal(null)
      })
    })

    describe("on `email_send_status`", () => {
      let alertSpy

      beforeEach(() => {
        alertSpy = spy(global, "alert")
      })

      afterEach(() => alertSpy.restore())

      context("when the payload represents success", () => {
        beforeEach(() => {
          retroChannel.trigger("email_send_status", { success: true })
        })

        it("alerts the user to the success", () => {
          expect(alertSpy.getCall(0).args[0]).to.match(/will receive/i)
        })
      })

      context("when the payload represents a failure", () => {
        beforeEach(() => {
          retroChannel.trigger("email_send_status", { success: false })
        })

        it("alerts the user to the failure", () => {
          expect(alertSpy.getCall(0).args[0]).to.not.match(/will receive/i)
        })
      })
    })
  })
})
