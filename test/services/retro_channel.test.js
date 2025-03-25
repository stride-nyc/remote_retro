// TODO: NEED TO FIX THIS TEST
import { Socket, Channel } from "phoenix"
import { createStore } from "redux"

import RetroChannel from "../../web/static/js/services/retro_channel"
import STAGES from "../../web/static/js/configs/stages"
// TODO: This part not working - come back to this later
import { setupMockRetroChannel } from "../support/js/test_helper"

const { CLOSED } = STAGES

describe("RetroChannel", () => {
  let retroChannel
  let initialConnectMethod

  // ensure socket#connect is a no-op in tests
  beforeAll(() => {
    initialConnectMethod = Socket.prototype.connect
    Socket.prototype.connect = () => {}
  })

  afterAll(() => {
    Socket.prototype.connect = initialConnectMethod
  })

  describe("constructor", () => {
    beforeEach(() => {
      retroChannel = new RetroChannel({
        userToken: "38ddm2",
        retroUUID: "blurg",
      })
    })

    test("sets an instance of PhoenixChannel as a client", () => {
      expect(retroChannel.client.constructor).toEqual(Channel)
    })

    describe("the returned Phoenix channel channel", () => {
      let retroChannelClient

      beforeEach(() => {
        retroChannelClient = retroChannel.client
      })

      test("is closed", () => {
        expect(retroChannelClient.state).toEqual(CLOSED)
      })

      test("has a topic attribute identifying the retro with the supplied UUID", () => {
        expect(retroChannelClient.topic).toEqual("retro:blurg")
      })

      test("has a socket attribute referencing a phoenix socket", () => {
        expect(retroChannelClient.socket.constructor).toEqual(Socket)
      })

      describe("the socket", () => {
        test("contains a params object containing the supplied userToken", () => {
          const socketParams = retroChannelClient.socket.params()
          expect(socketParams.userToken).toEqual("38ddm2")
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
      let updateGroupSpy
      let updatePresenceSpy
      let updateRetroSpy
      let voteSubmissionSpy
      let voteRetractionSpy
      let setPresencesSpy
      let clock

      beforeEach(() => {
        addIdeaSpy = jest.fn()
        deleteIdeaSpy = jest.fn()
        updateIdeaSpy = jest.fn()
        updatePresenceSpy = jest.fn()
        updateGroupSpy = jest.fn()
        updateRetroSpy = jest.fn()
        voteSubmissionSpy = jest.fn()
        voteRetractionSpy = jest.fn()
        setPresencesSpy = jest.fn()
        jest.useFakeTimers()
        clock = Date.now()

        actions = {
          addIdea: addIdeaSpy,
          deleteIdea: deleteIdeaSpy,
          updateIdea: updateIdeaSpy,
          updateGroup: updateGroupSpy,
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

      afterEach(() => {
        jest.useRealTimers()
      })

      describe("on `presence_state`", () => {
        test("invokes the setPresences action", () => {
          retroChannelClient.trigger("presence_state", {})
          expect(setPresencesSpy).toHaveBeenCalledTimes(1)
        })
      })

      describe("on `idea_committed`", () => {
        test("invokes the addIdea action", () => {
          retroChannelClient.trigger("idea_committed", { body: "zerp" })
          expect(addIdeaSpy).toHaveBeenCalledWith({ body: "zerp" })
        })
      })

      describe("on `retro_edited`", () => {
        test("invokes the retroUpdateCommitted action, passing the payload", () => {
          const payload = { stage: "dummy value" }
          retroChannelClient.trigger("retro_edited", payload)
          expect(updateRetroSpy).toHaveBeenCalledWith(payload)
        })
      })

      describe("on `group_edited`", () => {
        test("invokes the updateGroup action, passing the payload", () => {
          const payload = { id: 5, label: "Tooling" }
          retroChannelClient.trigger("group_edited", payload)
          expect(updateGroupSpy).toHaveBeenCalledWith(payload)
        })
      })

      describe("on `idea_edit_state_enabled`", () => {
        test("invokes updateIdea with idea id, specifying that the edit is desired by another client", () => {
          retroChannelClient.trigger("idea_edit_state_enabled", { id: 2 })
          expect(updateIdeaSpy).toHaveBeenCalledWith(2, { inEditState: true, isLocalEdit: false })
        })
      })

      describe("on `idea_edit_state_disabled`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_edit_state_disabled", { id: 3 })
        })

        test("invokes updateIdea with idea id, passing edit nullification attributes", () => {
          expect(updateIdeaSpy).toHaveBeenCalledWith(3, { inEditState: false, liveEditText: null })
        })
      })

      describe("on `idea_dragged_in_grouping_stage`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_dragged_in_grouping_stage", { id: 3, x: 38.3, y: 91.2 })
        })

        test("invokes updateIdea with drag coordinates and indicator that it's being edited", () => {
          expect(updateIdeaSpy).toHaveBeenCalledWith(3, { x: 38.3, y: 91.2, inEditState: true })
        })
      })

      describe("on `idea_typing_event`", () => {
        beforeEach(() => {
          store = createStore(() => ({
            presences: [
              { is_typing: true, token: "abc", last_typed: clock },
              { is_typing: false, token: "s0meUserToken" },
            ],
          }))

          retroChannel = new RetroChannel({ userToken: "38ddm2", retroUUID: "blurg" })
          retroChannel.applyListenersWithDispatch(store, actions)
          retroChannelClient = retroChannel.client
        })

        test("dispatches action for updating the user with matching token to is_typing true with timestamp", () => {
          retroChannelClient.trigger("idea_typing_event", { userToken: "s0meUserToken" })
          expect(updatePresenceSpy).toHaveBeenCalledWith("s0meUserToken", { is_typing: true, last_typed: clock })
        })

        describe("when the user with matching token has already typed", () => {
          test("dispatches action for updating the user with matching token to is_typing false after a delay", () => {
            retroChannelClient.trigger("idea_typing_event", { userToken: "abc" })
            jest.advanceTimersByTime(900)
            expect(updatePresenceSpy).toHaveBeenCalledWith("abc", { is_typing: false })
          })

          test("delays setting `is_typing` back to false if the event is received again", () => {
            retroChannelClient.trigger("idea_typing_event", { userToken: "abc" })
            jest.advanceTimersByTime(400)
            retroChannelClient.trigger("idea_typing_event", { userToken: "abc" })
            jest.advanceTimersByTime(500)
            expect(updatePresenceSpy).not.toHaveBeenCalledWith("abc", { is_typing: false })
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

          test("does not throw an error", () => {
            expect(() => {
              retroChannelClient.trigger("idea_typing_event", { userToken: "tokenRepresentingUserNotCurrentlyPresent" })
              jest.advanceTimersByTime(900)
            }).not.toThrow()
          })
        })
      })

      describe("on `idea_live_edit`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_live_edit", { id: 2, liveEditText: "lalala" })
        })

        test("invokes the updateIdea action with idea id, passing the `liveEditText` value along", () => {
          expect(updateIdeaSpy).toHaveBeenCalledWith(2, { id: 2, liveEditText: "lalala" })
        })
      })

      describe("on `idea_deleted`", () => {
        test("invokes deleteIdea action, passing in the idea's id", () => {
          retroChannelClient.trigger("idea_deleted", { id: 6 })
          expect(deleteIdeaSpy).toHaveBeenCalledWith(6)
        })
      })

      describe("on `idea_edited`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_edited", { id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES" })
        })

        test("invokes updateIdea action, passing idea id & nulling the editing attributes", () => {
          expect(updateIdeaSpy).toHaveBeenCalledWith(2, {
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

        test("invokes the voteSubmission action, passing the vote", () => {
          expect(voteSubmissionSpy).toHaveBeenCalledWith({
            idea_id: 50,
            user_id: 99,
          })
        })
      })

      describe("on `vote_retracted`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("vote_retracted", { id: 21 })
        })

        test("invokes the voteRetraction action, passing the vote", () => {
          expect(voteRetractionSpy).toHaveBeenCalledWith({ id: 21 })
        })
      })
    })
  })

  describe("#join", () => {
    beforeEach(() => {
      retroChannel = new RetroChannel({})
      retroChannel.client = { join: jest.fn() }
      retroChannel.join()
    })

    test("delegates to the client's join method", () => {
      expect(retroChannel.client.join).toHaveBeenCalled()
    })
  })

  describe("#push", () => {
    beforeEach(() => {
      retroChannel = new RetroChannel({})
      retroChannel.client = { push: jest.fn() }
      retroChannel.push("bizarreStringToPush")
    })

    test("delegates to the client's push method, forwarding the arguments", () => {
      expect(retroChannel.client.push).toHaveBeenCalledWith("bizarreStringToPush")
    })
  })

  describe("#pushWithRetries", () => {
    let pushSpy
    let mockCallbacks

    beforeEach(() => {
      // use mock channel, as we need to trigger receives on the channel to verify callbacks
      retroChannel = setupMockRetroChannel()
      mockCallbacks = { onOk: jest.fn(), onErr: jest.fn() }
      pushSpy = jest.spyOn(retroChannel, "push")
      retroChannel.pushWithRetries("derp", { some: "values" }, mockCallbacks)
    })

    afterEach(() => {
      pushSpy.mockRestore()
    })

    test("calls push with the given message and payload", () => {
      expect(pushSpy).toHaveBeenCalledWith("derp", { some: "values" })
    })

    describe("when the push results in a success response", () => {
      let okSpy

      beforeEach(() => {
        okSpy = jest.fn()
        retroChannel = setupMockRetroChannel()
        retroChannel.pushWithRetries("derp", { some: "values" }, { onOk: okSpy, onErr: () => {} })
        retroChannel.__triggerReply("ok", { id: 101 })
      })

      test("invokes the onOk callback with the given payload", () => {
        expect(okSpy).toHaveBeenCalledWith({ id: 101 })
      })
    })

    describe("when the push results in an error response", () => {
      beforeEach(() => {
        jest.useFakeTimers()
        retroChannel = setupMockRetroChannel()
        pushSpy = jest.spyOn(retroChannel, "push")
        retroChannel.pushWithRetries("what", { some: "gives" }, mockCallbacks)
        retroChannel.__triggerReply("error", { one: "five" })
      })

      afterEach(() => {
        pushSpy.mockRestore()
        jest.useRealTimers()
      })

      test("retries the push only after a brief timeout", () => {
        expect(pushSpy).toHaveBeenCalledTimes(1)
        jest.advanceTimersByTime(1000)
        expect(pushSpy).toHaveBeenCalledTimes(2)
      })

      describe("when the retry results in an error response", () => {
        test("triggers a *second* retry after a longer timeout", () => {
          jest.advanceTimersByTime(1000)
          retroChannel.__triggerReply("error", { one: "two" })
          jest.advanceTimersByTime(3000)
          expect(pushSpy).toHaveBeenCalledTimes(3)
        })
      })

      describe("when the second retry results in an error response", () => {
        test("triggers a *third* retry after a longer timeout", () => {
          jest.advanceTimersByTime(1000)
          retroChannel.__triggerReply("error", {})
          jest.advanceTimersByTime(3000)
          retroChannel.__triggerReply("error", {})
          jest.advanceTimersByTime(5000)
          expect(pushSpy).toHaveBeenCalledTimes(4)
        })
      })

      describe("when the third retry results in an error response", () => {
        test("invokes the onErr callback with error payload", () => {
          jest.advanceTimersByTime(1000)
          retroChannel.__triggerReply("error", {})
          jest.advanceTimersByTime(3000)
          retroChannel.__triggerReply("error", {})
          jest.advanceTimersByTime(5000)
          retroChannel.__triggerReply("error", { fart: "store" })
          expect(mockCallbacks.onErr).toHaveBeenCalledWith({ fart: "store" })
        })
      })
    })
  })
})
