import React from "react"
import { shallow } from "enzyme"
import { spy, useFakeTimers } from "sinon"

import { RemoteRetro } from "../../web/static/js/components/remote_retro"
import RetroChannel from "../../web/static/js/services/retro_channel"

describe("<RemoteRetro>", () => {
  describe("RetroChannel Events", () => {
    let retroChannel
    let wrapper // eslint-disable-line no-unused-vars
    let actions
    let addIdeaSpy
    let deleteIdeaSpy
    let updateIdeaSpy
    let updateStageSpy
    let clock
    const now = Date.now().toString()

    beforeEach(() => {
      addIdeaSpy = spy()
      deleteIdeaSpy = spy()
      updateIdeaSpy = spy()
      updateStageSpy = spy()
      clock = useFakeTimers(Date.now())

      actions = {
        addIdea: addIdeaSpy,
        deleteIdea: deleteIdeaSpy,
        updateIdea: updateIdeaSpy,
        updateStage: updateStageSpy,
      }

      const mockUser = {
        id: 1,
        token: "userToken",
      }

      retroChannel = RetroChannel.configure({})
      wrapper = shallow(
        <RemoteRetro
          users={[mockUser]}
          ideas={[]}
          stage="idea-generation"
          actions={actions}
          userToken="userToken"
          retroChannel={retroChannel}
          insertedAt={now}
        />
      )
    })

    describe("on `new_idea_received`", () => {
      it("invokes the addIdea action", () => {
        retroChannel.trigger("new_idea_received", { body: "zerp" })
        expect(addIdeaSpy.calledWith({ body: "zerp" })).to.equal(true)
      })
      context("when the currentUser created the idea", () => {
        it("calls updateIdea action after a timeout of 5000ms", () => {
          retroChannel.trigger("new_idea_received", { id: 5, body: "derp", user_id: 1 })
          clock.tick(5000)
          expect(updateIdeaSpy.calledWith(5, {})).to.equal(true)
        })
      })
    })

    describe("on `proceed_to_next_stage`", () => {
      it("invokes the updateStage action, passing the stage from the payload", () => {
        retroChannel.trigger("proceed_to_next_stage", { stage: "dummy value" })
        expect(updateStageSpy.calledWith("dummy value")).to.equal(true)
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
        let actions
        let updateUserSpy

        beforeEach(() => {
          retroChannel = RetroChannel.configure({})

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
              stage="idea-generation"
              retroChannel={retroChannel}
              actions={actions}
              ideas={[]}
              insertedAt={now}
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
      it("invokes deleteIdea action, passing in the idea's id", () => {
        retroChannel.trigger("idea_deleted", { id: 6 })
        expect(deleteIdeaSpy.calledWith(6)).to.equal(true)
      })
    })

    describe("on `idea_edited`", () => {
      beforeEach(() => {
        retroChannel.trigger("idea_edited", { id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES" })
      })

      it("invokes updateIdea action, passing idea id & nulling the editing attributes", () => {
        expect(updateIdeaSpy.calledWith(2, {
          id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES", liveEditText: null, editing: false,
        })).to.eql(true)
      })
    })
  })
})
