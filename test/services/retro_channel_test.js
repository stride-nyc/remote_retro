import { Socket, Channel } from "phoenix"
import { spy, stub, useFakeTimers } from "sinon"
import { createStore } from "redux"

import RetroChannel from "../../web/static/js/services/retro_channel"
import STAGES from "../../web/static/js/configs/stages"
import { setupMockRetroChannel } from "../support/js/test_helper"

const { CLOSED } = STAGES

describe("RetroChannel", () => {
  let retroChannel
  let initialConnectMethod
  // ensure socket#connect is a no-op in tests

  before(() => {
    initialConnectMethod = Socket.prototype.connect
    Socket.prototype.connect = () => {}
  })

  after(() => {
    Socket.prototype.connect = initialConnectMethod
  })

  describe("constructor", () => {
    beforeEach(() => {
      retroChannel = new RetroChannel({
        userToken: "38ddm2",
        retroUUID: "blurg",
      })
    })

    it("sets an instance of PhoenixChannel as a client", () => {
      expect(retroChannel.client.constructor).to.equal(Channel)
    })

    describe("the returned Phoenix channel channel", () => {
      let retroChannelClient

      beforeEach(() => {
        retroChannelClient = retroChannel.client
      })

      it("is closed", () => {
        expect(retroChannelClient.state).to.equal(CLOSED)
      })

      it("has a topic attribute identifying the retro with the supplied UUID", () => {
        expect(retroChannelClient.topic).to.equal("retro:blurg")
      })

      it("has a socket attribute referencing a phoenix socket", () => {
        expect(retroChannelClient.socket.constructor).to.equal(Socket)
      })

      describe("the socket", () => {
        it("contains a params object containing the supplied userToken", () => {
          const socketParams = retroChannelClient.socket.params()
          expect(socketParams.userToken).to.equal("38ddm2")
        })
      })
    })
  })

  describe("#applyListenersWithDispatch", () => {
    describe("the returned channel", () => {
      let retroChannel
      let retroChannelClient
      let actions
      let store
      let addIdeaSpy
      let deleteIdeaSpy
      let updateIdeaSpy
      let updatePresenceSpy
      let updateRetroSpy
      let voteSubmissionSpy
      let voteRetractionSpy
      let setPresencesSpy
      let clock

      beforeEach(() => {
        addIdeaSpy = spy()
        deleteIdeaSpy = spy()
        updateIdeaSpy = spy()
        updatePresenceSpy = spy()
        updateRetroSpy = spy()
        voteSubmissionSpy = spy()
        voteRetractionSpy = spy()
        setPresencesSpy = spy()
        clock = useFakeTimers(Date.now())

        actions = {
          addIdea: addIdeaSpy,
          deleteIdea: deleteIdeaSpy,
          updateIdea: updateIdeaSpy,
          updatePresence: updatePresenceSpy,
          retroUpdateCommitted: updateRetroSpy,
          setPresences: setPresencesSpy,
          voteSubmission: voteSubmissionSpy,
          voteRetraction: voteRetractionSpy,
        }

        store = { getState: () => {} }

        retroChannel = new RetroChannel({ userToken: "38ddm2", retroUUID: "blurg" })
        retroChannel.applyListenersWithDispatch(store, actions)
        retroChannelClient = retroChannel.client
      })

      describe("on `presence_state`", () => {
        it("invokes the setPresences action", () => {
          retroChannelClient.trigger("presence_state", {})
          expect(setPresencesSpy.calledOnce).to.be.true
        })
      })

      describe("on `idea_committed`", () => {
        it("invokes the addIdea action", () => {
          retroChannelClient.trigger("idea_committed", { body: "zerp" })
          expect(addIdeaSpy).calledWith({ body: "zerp" })
        })
      })

      describe("on `retro_edited`", () => {
        it("invokes the retroUpdateCommitted action, passing the payload", () => {
          const payload = { stage: "dummy value" }
          retroChannelClient.trigger("retro_edited", payload)
          expect(updateRetroSpy).calledWith(payload)
        })
      })

      describe("on `idea_edit_state_enabled`", () => {
        it("invokes updateIdea with idea id, specifying that the edit is desired by another client", () => {
          retroChannelClient.trigger("idea_edit_state_enabled", { id: 2 })

          expect(updateIdeaSpy).calledWith(2, { inEditState: true, isLocalEdit: false })
        })
      })

      describe("on `idea_edit_state_disabled`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_edit_state_disabled", { id: 3 })
        })

        it("invokes updateIdea with idea id, passing edit nullification attributes", () => {
          expect(updateIdeaSpy).calledWith(3, { inEditState: false, liveEditText: null })
        })
      })

      describe("on `idea_dragged_in_grouping_stage`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_dragged_in_grouping_stage", { id: 3, x: 38.3, y: 91.2 })
        })

        it("invokes updateIdea with drag coordinates and indicator that it's being edited", () => {
          expect(updateIdeaSpy).calledWith(3, { x: 38.3, y: 91.2, inEditState: true })
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

          retroChannel = new RetroChannel({ userToken: "38ddm2", retroUUID: "blurg" })
          retroChannel.applyListenersWithDispatch(store, actions)
          retroChannelClient = retroChannel.client
        })

        afterEach(() => { clock.restore() })

        it("dispatches action for updating the user with matching token to is_typing true with timestamp", () => {
          retroChannelClient.trigger("idea_typing_event", { userToken: "s0meUserToken" })

          expect(updatePresenceSpy).calledWith("s0meUserToken", { is_typing: true, last_typed: clock.now })
        })

        describe("when the user with matching token has already typed", () => {
          it("dispatches action for updating the user with matching token to is_typing false after a delay", () => {
            retroChannelClient.trigger("idea_typing_event", { userToken: "abc" })
            clock.tick(900)

            expect(updatePresenceSpy).calledWith("abc", { is_typing: false })
          })

          it("delays setting `is_typing` back to false if the event is received again", () => {
            retroChannelClient.trigger("idea_typing_event", { userToken: "abc" })
            clock.tick(400)
            clock.restore() // necessary, as Date.now is used at 10ms interval in implementation
            clock = useFakeTimers(Date.now())
            retroChannelClient.trigger("idea_typing_event", { userToken: "abc" })
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

            retroChannel = new RetroChannel({ userToken: "38ddm2", retroUUID: "blurg" })
            retroChannel.applyListenersWithDispatch(store, actions)
            retroChannelClient = retroChannel.client
          })

          it("does not throw an error", () => {
            expect(() => {
              retroChannelClient.trigger("idea_typing_event", { userToken: "tokenRepresentingUserNotCurrentlyPresent" })
              clock.tick(900)
            }).to.not.throw()
          })
        })
      })

      describe("on `idea_live_edit`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_live_edit", { id: 2, liveEditText: "lalala" })
        })

        it("invokes the updateIdea action with idea id, passing the `liveEditText` value along", () => {
          expect(updateIdeaSpy).calledWith(2, { id: 2, liveEditText: "lalala" })
        })
      })

      describe("on `idea_deleted`", () => {
        it("invokes deleteIdea action, passing in the idea's id", () => {
          retroChannelClient.trigger("idea_deleted", { id: 6 })
          expect(deleteIdeaSpy).calledWith(6)
        })
      })

      describe("on `idea_edited`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_edited", { id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES" })
        })

        it("invokes updateIdea action, passing idea id & nulling the editing attributes", () => {
          expect(updateIdeaSpy).calledWith(2, {
            id: 2,
            body: "i like TEENAGE MUTANT NINJA TURTLES",
            inEditState: false,
            liveEditText: null,
            isLocalEdit: null,
            editSubmitted: false,
          })
        })
      })

      describe("on `vote_submitted`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("vote_submitted", {
            idea_id: 50,
            user_id: 99,
          })
        })

        it("invokes the voteSubmission action, passing the vote", () => {
          expect(voteSubmissionSpy).calledWith({
            idea_id: 50,
            user_id: 99,
          })
        })
      })

      describe("on `vote_retracted`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("vote_retracted", { id: 21 })
        })

        it("invokes the voteRetraction action, passing the vote", () => {
          expect(voteRetractionSpy).calledWith({ id: 21 })
        })
      })
    })
  })

  describe("#join", () => {
    beforeEach(() => {
      retroChannel = new RetroChannel({})
      retroChannel.client = { join: spy() }

      retroChannel.join()
    })

    it("delegates to the client's join method", () => {
      expect(retroChannel.client.join).to.have.been.called
    })
  })

  describe("#push", () => {
    beforeEach(() => {
      retroChannel = new RetroChannel({})
      retroChannel.client = { push: spy() }

      retroChannel.push("bizarreStringToPush")
    })

    it("delegates to the client's push method, forwarding the arguments", () => {
      expect(retroChannel.client.push).to.have.been.calledWith("bizarreStringToPush")
    })
  })

  describe("#pushWithRetries", () => {
    let pushSpy
    let mockCallbacks

    beforeEach(() => {
      // use mock channel, as we need to trigger receives on the channel to verify callbacks
      retroChannel = setupMockRetroChannel()
      mockCallbacks = { onOk: spy(), onErr: spy() }
      pushSpy = spy(retroChannel, "push")
      retroChannel.pushWithRetries("derp", { some: "values" }, mockCallbacks)
    })

    afterEach(() => {
      pushSpy.restore()
    })

    it("calls push with the given message and payload", () => {
      expect(pushSpy).to.have.been.calledWithMatch("derp", { some: "values" })
    })

    describe("when the push results in a success response", () => {
      let okSpy

      beforeEach(() => {
        okSpy = spy()
        retroChannel = setupMockRetroChannel()
        retroChannel.pushWithRetries("derp", { some: "values" }, { onOk: okSpy, onErr: () => {} })

        retroChannel.__triggerReply("ok", { id: 101 })
      })

      it("invokes the onOk callback with the given payload", () => {
        expect(okSpy).to.have.been.calledWithMatch({ id: 101 })
      })
    })

    describe("when the push results in an error response", () => {
      let clock
      let spyHook

      beforeEach(() => {
        clock = useFakeTimers()
        retroChannel = setupMockRetroChannel()

        spyHook = {}
        addRetrySpyToPushResult(retroChannel, spyHook)

        retroChannel.pushWithRetries("what", { some: "gives" }, mockCallbacks)

        retroChannel.__triggerReply("error", { one: "five" })
      })

      afterEach(() => {
        retroChannel.push.restore()
        clock.restore()
      })

      it("retries the push only after a brief timeout", () => {
        expect(() => {
          clock.tick(1000)
        }).to.alter(() => (spyHook.retrySpy.called), {
          from: false,
          to: true,
        })
      })

      describe("when the retry results in an error response", () => {
        it("triggers a *second* retry after a longer timeout", () => {
          clock.tick(1000)

          expect(() => {
            retroChannel.__triggerReply("error", { one: "two" })
            clock.tick(3000)
          }).to.alter(() => (spyHook.retrySpy.callCount), {
            from: 1,
            to: 2,
          })
        })
      })

      describe("when the second retry results in an error response", () => {
        it("triggers a *third* retry after a longer timeout", () => {
          clock.tick(1000)
          retroChannel.__triggerReply("error", {})
          clock.tick(3000)

          expect(() => {
            retroChannel.__triggerReply("error", {})
            clock.tick(5000)
          }).to.alter(() => (spyHook.retrySpy.callCount), {
            from: 2,
            to: 3,
          })
        })
      })

      describe("when the third retry results in an error response", () => {
        it("invokes the onErr callback with error payload", () => {
          clock.tick(1000)
          retroChannel.__triggerReply("error", {})
          clock.tick(3000)
          retroChannel.__triggerReply("error", {})
          clock.tick(5000)

          expect(() => {
            retroChannel.__triggerReply("error", { fart: "store" })
          }).to.alter(() => (
            mockCallbacks.onErr.calledWithMatch({ fart: "store" })
          ), {
            from: false,
            to: true,
          })
        })
      })
    })
  })
})

const addRetrySpyToPushResult = (retroChannel, hook) => {
  const originalPushImplementation = retroChannel.push.bind(retroChannel)

  stub(retroChannel, "push", (...args) => {
    const push = originalPushImplementation(...args)

    hook.retrySpy = spy(push, "send")

    return push
  })
}
