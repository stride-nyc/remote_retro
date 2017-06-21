import React from "react"
import { shallow } from "enzyme"
import { spy, useFakeTimers } from "sinon"

import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import RetroChannel from "../../web/static/js/services/retro_channel"

describe("<RemoteRetro>", () => {
  describe("RetroChannel Events", () => {
    let retroChannel
    let wrapper
    let actions
    let addIdeaSpy
    let deleteIdeaSpy
    let updateIdeaSpy

    beforeEach(() => {
      addIdeaSpy = spy()
      deleteIdeaSpy = spy()
      updateIdeaSpy = spy()

      actions = {
        addIdea: addIdeaSpy,
        deleteIdea: deleteIdeaSpy,
        updateIdea: updateIdeaSpy,
      }
      retroChannel = RetroChannel.configure({})
      wrapper = shallow(<RemoteRetro users={[]} ideas={[]} actions={actions} userToken="userToken" retroChannel={retroChannel} />)
    })

    describe("on `new_idea_received`", () => {
      it("invokes the addIdea action", () => {
        retroChannel.trigger("new_idea_received", { body: "zerp" })
        expect(addIdeaSpy.calledWith({ body: "zerp" })).to.equal(true)
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
      it("invokes the updateIdea action with idea id and `editing` => true", () => {
        retroChannel.trigger("enable_edit_state", { id: 2 })

        expect(updateIdeaSpy.calledWith(2, { editing: true })).to.equal(true)
      })
    })

    describe("on `disable_edit_state`", () => {
      beforeEach(() => {
        retroChannel.trigger("disable_edit_state", { id: 3 })
      })

      it("invokes the updateIdea action with idea id and `editing` => false, `liveEditText` => null", () => {
        expect(updateIdeaSpy.calledWith(3, { editing: false, liveEditText: null })).to.equal(true)
      })
    })

    describe("on `user_typing_idea`", () => {
      describe("when no presence is currently typing", () => {
        let clock
        let actions
        let updateUserSpy

        beforeEach(() => {
          retroChannel = RetroChannel.configure({})
          clock = useFakeTimers(Date.now())

          const initialUsers = [
            { is_typing: true, token: "abc", last_typed: clock.now },
            { is_typing: false, token: "s0meUserToken" },
          ]

          updateUserSpy = spy()
          actions = { updateUser: updateUserSpy }

          wrapper = shallow(
            <RemoteRetro
              users={initialUsers}
              userToken="userToken"
              retroChannel={retroChannel}
              actions={actions}
              ideas={[]}
            />
          )
        })

        afterEach(() => { clock.restore() })

        it("dispatches action for updating the user with matching token to is_typing true with timestamp", () => {
          retroChannel.trigger("user_typing_idea", { userToken: "s0meUserToken" })

          expect(
            updateUserSpy.calledWith("s0meUserToken", { is_typing: true, last_typed: clock.now })
          ).to.equal(true)
        })

        describe("when the user with matching token has already typed", () => {
          it("dispatches action for updating the user with matching token to is_typing false after a delay", () => {
            retroChannel.trigger("user_typing_idea", { userToken: "abc" })
            clock.tick(900)

            expect(
              updateUserSpy.calledWith("abc", { is_typing: false })
            ).to.equal(true)
          })

          it("delays setting `is_typing` back to false if the event is received again", () => {
            retroChannel.trigger("user_typing_idea", { userToken: "abc" })
            clock.tick(400)
            clock.restore() // necessary, as Date.now is used at 10ms interval in the implementation
            clock = useFakeTimers(Date.now())
            retroChannel.trigger("user_typing_idea", { userToken: "abc" })
            clock.tick(500)
            expect(
              updateUserSpy.calledWith("abc", { is_typing: false })
            ).to.equal(false)
          })
        })
      })
    })

    describe("on `idea_live_edit`", () => {
      beforeEach(() => {
        retroChannel.trigger("idea_live_edit", { id: 2, liveEditText: "lalala" })
      })

      it("invokes the updateIdea action with idea id, passing the `liveEditText` value along", () => {
        expect(updateIdeaSpy.calledWith(2, { id: 2, liveEditText: "lalala" })).to.equal(true)
      })
    })

    describe("on `idea_deleted`", () => {
      it("removes the idea passed in the payload from state.ideas", () => {
        retroChannel.trigger("idea_deleted", { id: 6 })
        expect(deleteIdeaSpy.calledWith(6)).to.equal(true)
      })
    })

    describe("on `idea_edited`", () => {
      beforeEach(() => {
        retroChannel.trigger("idea_edited", { id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES" })
      })

      it("updates the idea with matching id on state, and nulls out `editing` and `liveEditText`", () => {
        expect(updateIdeaSpy.calledWith(2, {
          id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES", liveEditText: null, editing: false,
        })).to.eql(true)
      })
    })
  })
})
