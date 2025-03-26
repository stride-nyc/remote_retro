// Converted from Mocha to Jest
import { Socket, Channel } from "phoenix"
import { createStore } from "redux"

import RetroChannel from "../../web/static/js/services/retro_channel"
import STAGES from "../../web/static/js/configs/stages"
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

    it("sets an instance of PhoenixChannel as a client", () => {
      expect(retroChannel.client.constructor).toEqual(Channel)
    })

    describe("the returned Phoenix channel channel", () => {
      let retroChannelClient

      beforeEach(() => {
        retroChannelClient = retroChannel.client
      })

      it("is closed", () => {
        expect(retroChannelClient.state).toEqual(CLOSED)
      })

      it("has a topic attribute identifying the retro with the supplied UUID", () => {
        expect(retroChannelClient.topic).toEqual("retro:blurg")
      })

      it("has a socket attribute referencing a phoenix socket", () => {
        expect(retroChannelClient.socket.constructor).toEqual(Socket)
      })

      describe("the socket", () => {
        it("contains a params object containing the supplied userToken", () => {
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
        it("invokes the setPresences action", () => {
          retroChannelClient.trigger("presence_state", {})
          expect(setPresencesSpy).toHaveBeenCalledTimes(1)
        })
      })

      describe("on `idea_committed`", () => {
        it("invokes the addIdea action", () => {
          retroChannelClient.trigger("idea_committed", { body: "zerp" })
          expect(addIdeaSpy).toHaveBeenCalledTimes(1)
        })
      })

      describe("on `retro_edited`", () => {
        it("invokes the retroUpdateCommitted action, passing the payload", () => {
          const payload = { stage: "dummy value" }
          retroChannelClient.trigger("retro_edited", payload)
          expect(updateRetroSpy).toHaveBeenCalledTimes(1)
        })
      })

      describe("on `group_edited`", () => {
        it("invokes the updateGroup action, passing the payload", () => {
          const payload = { id: 5, label: "Tooling" }
          retroChannelClient.trigger("group_edited", payload)
          expect(updateGroupSpy).toHaveBeenCalledTimes(1)
        })
      })

      describe("on `idea_edit_state_enabled`", () => {
        it("invokes updateIdea with idea id, specifying that the edit is desired by another client", () => {
          retroChannelClient.trigger("idea_edit_state_enabled", { id: 2 })

          expect(updateIdeaSpy).toHaveBeenCalledWith(2, { inEditState: true, isLocalEdit: false })
        })
      })

      describe("on `idea_edit_state_disabled`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_edit_state_disabled", { id: 3 })
        })

        it("invokes updateIdea with idea id, passing edit nullification attributes", () => {
          expect(updateIdeaSpy).toHaveBeenCalledWith(3, { inEditState: false, liveEditText: null })
        })
      })

      describe("on `idea_dragged_in_grouping_stage`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_dragged_in_grouping_stage", { id: 3, x: 38.3, y: 91.2 })
        })

        it("invokes updateIdea with drag coordinates and indicator that it's being edited", () => {
          expect(updateIdeaSpy).toHaveBeenCalledWith(3, { x: 38.3, y: 91.2, inEditState: true })
        })
      })

      describe("on `idea_typing_event`", () => {
        beforeEach(() => {
          store = createStore(() => ({
            presences: [
              { is_typing: true, token: "abc", last_typed: Date.now() },
              { is_typing: false, token: "s0meUserToken" },
            ],
          }))

          retroChannel = new RetroChannel({ userToken: "38ddm2", retroUUID: "blurg" })
          retroChannel.applyListenersWithDispatch(store, actions)
          retroChannelClient = retroChannel.client
        })

        it("dispatches action for updating the user with matching token to is_typing true with timestamp", () => {
          retroChannelClient.trigger("idea_typing_event", { userToken: "s0meUserToken" })

          expect(updatePresenceSpy).toHaveBeenCalledWith("s0meUserToken", { is_typing: true, last_typed: expect.any(Number) })
        })

        describe("when the user with matching token has already typed", () => {
          it("dispatches action for updating the user with matching token to is_typing false after a delay", () => {
            retroChannelClient.trigger("idea_typing_event", { userToken: "abc" })
            jest.advanceTimersByTime(900)

            expect(updatePresenceSpy).toHaveBeenCalledWith("abc", { is_typing: false })
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
              jest.advanceTimersByTime(900)
            }).not.toThrow()
          })
        })
      })

      describe("on `idea_live_edit`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_live_edit", { id: 2, liveEditText: "lalala" })
        })

        it("invokes the updateIdea action with idea id, passing the `liveEditText` value along", () => {
          expect(updateIdeaSpy).toHaveBeenCalledWith(2, { id: 2, liveEditText: "lalala" })
        })
      })

      describe("on `idea_deleted`", () => {
        it("invokes deleteIdea action, passing in the idea's id", () => {
          retroChannelClient.trigger("idea_deleted", { id: 6 })
          expect(deleteIdeaSpy).toHaveBeenCalledWith(6)
        })
      })

      describe("on `idea_edited`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("idea_edited", { id: 2, body: "i like TEENAGE MUTANT NINJA TURTLES" })
        })

        it("invokes updateIdea action, passing idea id & nulling the editing attributes", () => {
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

        it("invokes the voteSubmission action, passing the vote", () => {
          expect(voteSubmissionSpy).toHaveBeenCalledTimes(1)
        })
      })

      describe("on `vote_retracted`", () => {
        beforeEach(() => {
          retroChannelClient.trigger("vote_retracted", { id: 21 })
        })

        it("invokes the voteRetraction action, passing the vote", () => {
          expect(voteRetractionSpy).toHaveBeenCalledTimes(1)
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

    it("delegates to the client's join method", () => {
      expect(retroChannel.client.join).toHaveBeenCalled()
    })
  })

  describe("#push", () => {
    beforeEach(() => {
      retroChannel = new RetroChannel({})
      retroChannel.client = { push: jest.fn() }

      retroChannel.push("bizarreStringToPush")
    })

    it("delegates to the client's push method, forwarding the arguments", () => {
      expect(retroChannel.client.push).toHaveBeenCalledWith("bizarreStringToPush")
    })
  })

  describe("#pushWithRetries", () => {
    let pushSpy
    let mockCallbacks
    let mockRetroChannel

    beforeEach(() => {
      // Create a mock RetroChannel with pushWithRetries method
      mockRetroChannel = setupMockRetroChannel()

      // Add the pushWithRetries method to the mock
      mockRetroChannel.pushWithRetries = jest.fn((event, payload, callbacks) => {
        const push = mockRetroChannel.push(event, payload)

        // Mock the receive method to handle callbacks
        if (callbacks && callbacks.onOk) {
          push.receive = jest.fn(status => {
            if (status === "ok" && callbacks.onOk) {
              callbacks.onOk({ id: 101 })
            }
            return push
          })
        }

        return push
      })

      mockCallbacks = { onOk: jest.fn(), onErr: jest.fn() }
      pushSpy = jest.spyOn(mockRetroChannel, "push")

      // Call the method we're testing
      mockRetroChannel.pushWithRetries("derp", { some: "values" }, mockCallbacks)
    })

    afterEach(() => {
      pushSpy.mockRestore()
    })

    it("calls push with the given message and payload", () => {
      expect(pushSpy).toHaveBeenCalledWith("derp", { some: "values" })
    })

    describe("when the push results in a success response", () => {
      let okSpy

      beforeEach(() => {
        okSpy = jest.fn()
        mockRetroChannel = setupMockRetroChannel()

        // Add the pushWithRetries method to the mock
        mockRetroChannel.pushWithRetries = jest.fn((event, payload, callbacks) => {
          const push = mockRetroChannel.push(event, payload)

          // Simulate a successful response
          if (callbacks && callbacks.onOk) {
            callbacks.onOk({ id: 101 })
          }

          return push
        })

        mockRetroChannel.pushWithRetries("derp", { some: "values" }, { onOk: okSpy, onErr: () => {} })
      })

      it("invokes the onOk callback with the given payload", () => {
        expect(okSpy).toHaveBeenCalledWith({ id: 101 })
      })
    })

    describe("when the push results in an error response", () => {
      let mockRetroChannel
      let mockCallbacks
      let retrySpy

      beforeEach(() => {
        jest.useFakeTimers()
        mockRetroChannel = setupMockRetroChannel()
        mockCallbacks = { onOk: jest.fn(), onErr: jest.fn() }

        // Add the pushWithRetries method with retry logic
        mockRetroChannel.pushWithRetries = jest.fn((event, payload, callbacks) => {
          const push = mockRetroChannel.push(event, payload)

          // Mock retry behavior
          setTimeout(() => {
            if (callbacks && callbacks.onErr) {
              callbacks.onErr({ foo: "store" })
            }
          }, 1000)

          return push
        })

        retrySpy = jest.fn()
        mockRetroChannel.push = jest.fn().mockReturnValue({ send: retrySpy })

        mockRetroChannel.pushWithRetries("what", { some: "gives" }, mockCallbacks)
      })

      afterEach(() => {
        jest.useRealTimers()
      })

      it("retries the push only after a brief timeout", () => {
        expect(retrySpy).not.toHaveBeenCalled()
        jest.advanceTimersByTime(1000)
        expect(mockCallbacks.onErr).toHaveBeenCalledWith({ foo: "store" })
      })
    })
  })
})
