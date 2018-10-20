import { Socket, Channel } from "phoenix"
import { spy, useFakeTimers } from "sinon"
import { createStore } from "redux"

import RetroChannel, { applyListenersWithDispatch } from "../../web/static/js/services/retro_channel"
import STAGES from "../../web/static/js/configs/stages"

const { CLOSED } = STAGES

describe("RetroChannel", () => {
  let initialConnectMethod
  // ensure socket#connect is a no-op in tests

  before(() => {
    Socket.prototype.connect = () => {}
  })

  after(() => {
    Socket.prototype.connect = initialConnectMethod
  })

  describe(".configure", () => {
    let result

    beforeEach(() => {
      result = RetroChannel.configure({
        userToken: "38ddm2",
        retroUUID: "blurg",
      })
    })

    it("returns an instance of PhoenixChannel", () => {
      expect(result.constructor).to.equal(Channel)
    })

    describe("the returned Phoenix channel", () => {
      it("is closed", () => {
        expect(result.state).to.equal(CLOSED)
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
    })
  })

  describe("applyListenersWithDispatch", () => {
    describe("the returned channel", () => {
      let retroChannel
      let actions
      let store
      let addIdeaSpy
      let deleteIdeaSpy
      let updateIdeaSpy
      let updatePresenceSpy
      let updateRetroSpy
      let addVoteSpy
      let clock

      beforeEach(() => {
        addIdeaSpy = spy()
        deleteIdeaSpy = spy()
        updateIdeaSpy = spy()
        updatePresenceSpy = spy()
        updateRetroSpy = spy()
        addVoteSpy = spy()
        clock = useFakeTimers(Date.now())

        actions = {
          addIdea: addIdeaSpy,
          deleteIdea: deleteIdeaSpy,
          updateIdea: updateIdeaSpy,
          updatePresence: updatePresenceSpy,
          updateRetroSync: updateRetroSpy,
          addVote: addVoteSpy,
        }

        store = { getState: () => {} }

        retroChannel = RetroChannel.configure({ userToken: "38ddm2", retroUUID: "blurg" })
        retroChannel = applyListenersWithDispatch(retroChannel, store, actions)
      })

      describe("on `idea_committed`", () => {
        it("invokes the addIdea action", () => {
          retroChannel.trigger("idea_committed", { body: "zerp" })
          expect(addIdeaSpy).calledWith({ body: "zerp" })
        })
      })

      describe("on `retro_edited`", () => {
        it("invokes the updateRetroSync action, passing the payload", () => {
          const payload = { stage: "dummy value" }
          retroChannel.trigger("retro_edited", payload)
          expect(updateRetroSpy).calledWith(payload)
        })
      })

      describe("on `idea_edit_state_enabled`", () => {
        it("invokes updateIdea with idea id, specifying that the edit is desired by another client", () => {
          retroChannel.trigger("idea_edit_state_enabled", { id: 2 })

          expect(updateIdeaSpy).calledWith(2, { inEditState: true, isLocalEdit: false })
        })
      })

      describe("on `idea_edit_state_disabled`", () => {
        beforeEach(() => {
          retroChannel.trigger("idea_edit_state_disabled", { id: 3 })
        })

        it("invokes updateIdea with idea id, passing edit nullification attributes", () => {
          expect(updateIdeaSpy).calledWith(3, { inEditState: false, liveEditText: null })
        })
      })

      describe("on `idea_typing_event`", () => {
        beforeEach(() => {
          store = createStore(() => ({
            presences: [
              { is_typing: true, token: "abc", last_typed: clock.now },
              { is_typing: false, token: "s0meUserToken" },
            ],
          }))

          retroChannel = RetroChannel.configure({ userToken: "38ddm2", retroUUID: "blurg" })
          retroChannel = applyListenersWithDispatch(retroChannel, store, actions)
        })

        afterEach(() => { clock.restore() })

        it("dispatches action for updating the user with matching token to is_typing true with timestamp", () => {
          retroChannel.trigger("idea_typing_event", { userToken: "s0meUserToken" })

          expect(updatePresenceSpy).calledWith("s0meUserToken", { is_typing: true, last_typed: clock.now })
        })

        describe("when the user with matching token has already typed", () => {
          it("dispatches action for updating the user with matching token to is_typing false after a delay", () => {
            retroChannel.trigger("idea_typing_event", { userToken: "abc" })
            clock.tick(900)

            expect(updatePresenceSpy).calledWith("abc", { is_typing: false })
          })

          it("delays setting `is_typing` back to false if the event is received again", () => {
            retroChannel.trigger("idea_typing_event", { userToken: "abc" })
            clock.tick(400)
            clock.restore() // necessary, as Date.now is used at 10ms interval in implementation
            clock = useFakeTimers(Date.now())
            retroChannel.trigger("idea_typing_event", { userToken: "abc" })
            clock.tick(500)
            expect(updatePresenceSpy).not.calledWith("abc", { is_typing: false })
          })
        })

        describe("when the user with matching token is no longer present", () => {
          beforeEach(() => {
            store = createStore(() => ({
              presences: [
                { is_typing: false, token: "s0meUserToken" },
              ],
            }))

            retroChannel = RetroChannel.configure({ userToken: "38ddm2", retroUUID: "blurg" })
            retroChannel = applyListenersWithDispatch(retroChannel, store, actions)
          })

          it("does not throw an error", () => {
            expect(() => {
              retroChannel.trigger("idea_typing_event", { userToken: "tokenRepresentingUserNotCurrentlyPresent" })
              clock.tick(900)
            }).to.not.throw()
          })
        })
      })

      describe("on `idea_live_edit`", () => {
        beforeEach(() => {
          retroChannel.trigger("idea_live_edit", { id: 2, liveEditText: "lalala" })
        })

        it("invokes the updateIdea action with idea id, passing the `liveEditText` value along", () => {
          expect(updateIdeaSpy).calledWith(2, { id: 2, liveEditText: "lalala" })
        })
      })

      describe("on `idea_deleted`", () => {
        it("invokes deleteIdea action, passing in the idea's id", () => {
          retroChannel.trigger("idea_deleted", { id: 6 })
          expect(deleteIdeaSpy).calledWith(6)
        })
      })

      describe("on `idea_edited`", () => {
        beforeEach(() => {
          retroChannel.trigger("idea_edited", { id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES" })
        })

        it("invokes updateIdea action, passing idea id & nulling the editing attributes", () => {
          expect(updateIdeaSpy).calledWith(2, {
            id:
            2,
            body: "i like TEENAGE MUTANT NINJA TURTLES",
            liveEditText: null,
            inEditState: false,
            editSubmitted: false,
          })
        })
      })

      describe("on `vote_submitted`", () => {
        beforeEach(() => {
          retroChannel.trigger("vote_submitted",
            {
              idea_id: 50,
              user_id: 99,
            }
          )
        })

        it("invokes the addVote action, passing the vote", () => {
          expect(addVoteSpy).calledWith({
            idea_id: 50,
            user_id: 99,
          })
        })
      })
    })
  })
})

