import { Socket, Channel } from "phoenix"
import { spy, useFakeTimers } from "sinon"
import { createStore } from "redux"

import RetroChannel from "../../web/static/js/services/retro_channel"

describe("RetroChannel", () => {
  describe(".configure", () => {
    let result
    beforeEach(() => {
      result = RetroChannel.configure({
        userToken: "38ddm2",
        retroUUID: "blurg",
        actions: {},
      })
    })

    it("returns an instance of PhoenixChannel", () => {
      expect(result.constructor).to.equal(Channel)
    })

    describe("the returned Phoenix channel", () => {
      it("is closed", () => {
        expect(result.state).to.equal("closed")
      })

      it("has a topic attribute identifying the retro with the supplied UUID", () => {
        expect(result.topic).to.equal("retro:blurg")
      })

      it("has a socket attribute referencing a phoenix socket", () => {
        expect(result.socket.constructor).to.equal(Socket)
      })

      describe("the socket", () => {
        it("contains a params object containing the supplied userToken", () => {
          const socketParams = result.socket.params
          expect(socketParams.userToken).to.equal("38ddm2")
        })
      })

      describe("retroChannel Events", () => {
        let retroChannel
        let actions
        let addIdeaSpy
        let deleteIdeaSpy
        let updateIdeaSpy
        let updateUserSpy
        let updateStageSpy
        let clock

        beforeEach(() => {
          addIdeaSpy = spy()
          deleteIdeaSpy = spy()
          updateIdeaSpy = spy()
          updateUserSpy = spy()
          updateStageSpy = spy()
          clock = useFakeTimers(Date.now())

          actions = {
            addIdea: addIdeaSpy,
            deleteIdea: deleteIdeaSpy,
            updateIdea: updateIdeaSpy,
            updateUser: updateUserSpy,
            updateStage: updateStageSpy,
          }

          retroChannel = RetroChannel.configure({ actions })
        })

        describe("on `new_idea_received`", () => {
          it("invokes the addIdea action", () => {
            retroChannel.trigger("new_idea_received", { body: "zerp" })
            expect(addIdeaSpy.calledWith({ body: "zerp" })).to.equal(true)
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

          it("invokes updateIdea with idea id, `editing: false`, `liveEditText: null`", () => {
            expect(
              updateIdeaSpy.calledWith(3, { editing: false, liveEditText: null })
            ).to.equal(true)
          })
        })

        describe("on `user_typing_idea`", () => {
          let store

          beforeEach(() => {
            store = createStore(() => ({
              users: [
                { is_typing: true, token: "abc", last_typed: clock.now },
                { is_typing: false, token: "s0meUserToken" },
              ],
            }))

            retroChannel = RetroChannel.configure({ store, actions })
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
              clock.restore() // necessary, as Date.now is used at 10ms interval in implementation
              clock = useFakeTimers(Date.now())
              retroChannel.trigger("user_typing_idea", { userToken: "abc" })
              clock.tick(500)
              expect(
                updateUserSpy.calledWith("abc", { is_typing: false })
              ).to.equal(false)
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

        describe("on `vote_submitted`", () => {
          beforeEach(() => {
            retroChannel.trigger("vote_submitted", { idea: { id: 2, vote_count: 3 }})
          })

          it("invokes updateIdea action, passing idea id & vote count", () => {
            expect(updateIdeaSpy.calledWith(2, {
              vote_count: 3,
            })).to.eql(true)
          })
        })
      })
    })
  })
})

