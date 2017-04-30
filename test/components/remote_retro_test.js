import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import RemoteRetro from "../../web/static/js/components/remote_retro"
import RetroChannel from "../../web/static/js/services/retro_channel"

describe("<RemoteRetro>", () => {
  describe("RetroChannel Events", () => {
    let retroChannel
    let wrapper

    beforeEach(() => {
      retroChannel = RetroChannel.configure({})
      wrapper = shallow(<RemoteRetro userToken="userToken" retroChannel={retroChannel} />)
    })

    describe("on `retro_state`", () => {
      const mockPayloadFromServer = {
        ideas: [{ arbitrary: "content" }],
        stage: "larping",
      }

      it("sets the associated payload's `ideas` value on state", () => {
        expect(wrapper.state("ideas")).to.eql([])
        retroChannel.trigger("retro_state", mockPayloadFromServer)
        expect(wrapper.state("ideas")).to.eql([
          { arbitrary: "content" },
        ])
      })

      it("sets the associated payload's `stage` value on state", () => {
        expect(wrapper.state("stage")).to.equal("idea-generation")
        retroChannel.trigger("retro_state", mockPayloadFromServer)
        expect(wrapper.state("stage")).to.equal("larping")
      })
    })

    describe("on `new_idea_received`", () => {
      it("pushes the value passed in the payload into the `ideas` array", () => {
        wrapper.setState({ ideas: [{ body: "first idear" }] })

        retroChannel.trigger("new_idea_received", { body: "zerp" })

        expect(wrapper.state("ideas")).to.eql([
          { body: "first idear" },
          { body: "zerp" },
        ])
      })
    })

    describe("on `proceed_to_next_stage`", () => {
      it("updates the state's `stage` attribute to the value from proceed_to_next_stage", () => {
        expect(wrapper.state("stage")).to.equal("idea-generation")
        retroChannel.trigger("proceed_to_next_stage", { stage: "dummy value" })

        expect(wrapper.state("stage")).to.equal("dummy value")
      })

      context("when the `stage` in the payload is 'action-item-distribution'", () => {
        let alertSpy

        beforeEach(() => {
          alertSpy = spy(global, "alert")
          retroChannel.trigger("proceed_to_next_stage", { stage: "action-item-distribution" })
        })

        afterEach(() => alertSpy.restore())

        it("alerts the user that action items have been sent out", () => {
          expect(alertSpy.getCall(0).args[0]).to.match(/you will receive an email breakdown/i)
        })
      })
    })

    describe("on `enable_edit_state`", () => {
      it("updates the idea with matching id, setting `editing` to true", () => {
        const ideas = [
          { id: 1 },
          { id: 2 },
          { id: 3 },
        ]

        wrapper.setState({ ideas })

        retroChannel.trigger("enable_edit_state", { id: 2 })

        expect(wrapper.state("ideas")[1]).to.eql({ id: 2, editing: true })
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

        wrapper.setState({ ideas })
        retroChannel.trigger("disable_edit_state", { id: 3 })
        ideaWithMatchingId = wrapper.state("ideas").find(idea => idea.id === 3)
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

        wrapper.setState({ ideas })
        retroChannel.trigger("idea_live_edit", { id: 2, liveEditText: "lalala" })
        ideaWithMatchingId = wrapper.state("ideas").find(idea => idea.id === 2)
      })

      it("updates the idea with matching id, setting `liveEditText` to the payload value", () => {
        expect(ideaWithMatchingId.liveEditText).to.equal("lalala")
      })
    })

    describe("on `idea_deleted`", () => {
      it("removes the idea passed in the payload from state.ideas", () => {
        wrapper.setState({ ideas: [{ id: 6, body: "turtles" }] })
        retroChannel.trigger("idea_deleted", { id: 6 })

        expect(wrapper.state("ideas")).to.eql([])
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

        wrapper.setState({ ideas })
        retroChannel.trigger("idea_edited", { id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES" })
        editedIdea = wrapper.state("ideas").find(idea => (idea.id === 2))
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
  })
})
