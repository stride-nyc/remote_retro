import deepFreeze from "deep-freeze"
import sinon from "sinon"

import { setupMockRetroChannel } from "../support/js/test_helper"
import {
  actions as actionCreators,
  reducer as ideasReducer,
  _throttledPushOfDragToServer,
} from "../../web/static/js/redux/ideas"

describe("idea reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("should return an empty array", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(ideasReducer(undefined, {})).to.deep.equal([])
        expect(ideasReducer(undefined, unhandledAction)).to.deep.equal([])
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = [{ body: "we have a linter!", category: "happy", user_id: 1 }]
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(ideasReducer(initialState, {})).to.deep.equal(initialState)
        expect(ideasReducer(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })

  describe("the handled actions", () => {
    describe("when the action is IDEA_SUBMISSION_SUBMITTED", () => {
      it("adds the idea to list of ideas, but with an `id` of Infinity, so that it appears as the end of the list", () => {
        const initialState = [{ body: "i'm an old idea!", category: "happy", user_id: 2 }]
        deepFreeze(initialState)
        const idea = { body: "we have a linter!", category: "happy", user_id: 1 }
        const action = { type: "IDEA_SUBMISSION_SUBMITTED", idea }

        expect(ideasReducer(initialState, action)).to.deep.equal(
          [...initialState, { ...idea, id: Infinity }]
        )
      })
    })

    describe("when the action is IDEA_SUBMISSION_COMMITTED", () => {
      describe("when the idea is noted as being a replacement for an optimistically added idea", () => {
        it("replaces the idea with an id of Infinity with the given idea object, stripping the replacement flag", () => {
          const initialState = [
            { id: Infinity, body: "body", category: "happy", user_id: 2 },
            { id: 5, body: "who", category: "happy", user_id: 3 },
          ]

          deepFreeze(initialState)

          const idea = { shouldReplaceOptimisticallyAddedIdea: true, id: 4, body: "body", category: "happy", user_id: 2 }
          const action = { type: "IDEA_SUBMISSION_COMMITTED", idea }

          expect(ideasReducer(initialState, action)).to.deep.equal([
            { id: 4, body: "body", category: "happy", user_id: 2 },
            { id: 5, body: "who", category: "happy", user_id: 3 },
          ])
        })
      })

      describe("when the idea is *not* noted as having been optimistically added", () => {
        it("simply augments the idea list with the new idea", () => {
          const initialState = [{ body: "i'm an old idea!", category: "happy", user_id: 2 }]
          deepFreeze(initialState)
          const idea = { id: 5, body: "we have a linter!", category: "happy", user_id: 1 }
          const action = { type: "IDEA_SUBMISSION_COMMITTED", idea }

          expect(ideasReducer(initialState, action)).to.deep.equal([...initialState, idea])
        })
      })
    })

    describe("when the action is IDEA_SUBMISSION_REJECTED", () => {
      it("removes the idea with an id of Infinity from state", () => {
        const initialState = [
          { id: Infinity, body: "body", category: "happy", user_id: 2 },
          { id: 5, body: "who", category: "happy", user_id: 3 },
        ]

        deepFreeze(initialState)

        const action = { type: "IDEA_SUBMISSION_REJECTED" }

        expect(ideasReducer(initialState, action)).to.deep.equal([
          { id: 5, body: "who", category: "happy", user_id: 3 },
        ])
      })
    })

    describe("when the action is SET_INITIAL_STATE", () => {
      it("should replace the state with the ideas passed in the action's inialState object", () => {
        const initialIdeas = [{ body: "i'm an old idea!", category: "happy", user_id: 2 }]
        deepFreeze(initialIdeas)

        const newIdeas = [{ body: "modern convenience", category: "confused", user_id: 1 }]
        const action = { type: "SET_INITIAL_STATE", initialState: { ideas: newIdeas } }

        expect(ideasReducer(initialIdeas, action)).to.deep.equal([...newIdeas])
      })
    })

    describe("when the action is IDEA_UPDATE_REJECTED", () => {
      const initialIdeas = [{
        id: 666,
        editSubmitted: true,
      }, {
        id: 22,
      }]

      deepFreeze(initialIdeas)

      describe("when the idea params for the failed update contain x/y coordinates", () => {
        const action = { type: "IDEA_UPDATE_REJECTED", ideaId: 666, params: { x: 67, y: 101 } }

        it("nullifies all edit attributes", () => {
          expect(ideasReducer(initialIdeas, action)).to.deep.equal([
            {
              id: 666,
              editSubmitted: false,
              inEditState: false,
              isLocalEdit: null,
              liveEditText: null,
            },
            { id: 22 },
          ])
        })
      })

      describe("when the idea params for the failed update *lack* x/y coordinates", () => {
        const action = { type: "IDEA_UPDATE_REJECTED", ideaId: 666, params: { body: "so tired" } }

        it("returns updated set of ideas, where the idea with matching id is no longer in an edit submitted state", () => {
          expect(ideasReducer(initialIdeas, action)).to.deep.equal([
            { id: 666, editSubmitted: false },
            { id: 22 },
          ])
        })
      })
    })

    describe("when the action is IDEA_DELETION_COMMITTED", () => {
      const initialIdeas = [{ id: 667, category: "happy", user_id: 1 }, { id: 22, category: "n/a", user_id: 2 }]
      deepFreeze(initialIdeas)

      it("returns an updated set of ideas, where the idea with matching id has been removed", () => {
        const action = { type: "IDEA_DELETION_COMMITTED", ideaId: 667 }
        expect(ideasReducer(initialIdeas, action)).to.deep.equal([
          { id: 22, category: "n/a", user_id: 2 },
        ])
      })
    })

    describe("when the action is IDEA_DELETION_REJECTED", () => {
      const initialIdeas = [
        { id: 667, category: "happy", user_id: 1 },
        { id: 22, category: "n/a", user_id: 2, deletionSubmitted: true },
      ]
      deepFreeze(initialIdeas)

      it("returns an updated set of ideas, where the idea's no longer flagged as submitted for deletion", () => {
        const action = { type: "IDEA_DELETION_REJECTED", ideaId: 22 }
        expect(ideasReducer(initialIdeas, action)).to.deep.equal([
          { id: 667, category: "happy", user_id: 1 },
          { id: 22, category: "n/a", user_id: 2, deletionSubmitted: false },
        ])
      })
    })

    describe("when the action is RETRO_STAGE_PROGRESSION_COMMITTED", () => {
      context("when the payload contains data for ideas", () => {
        it("should replace the state with the ideas passed in the action's payload", () => {
          const initialState = []
          deepFreeze(initialState)

          const ideas = [{ id: 7, category: "sad", body: "no cookies", x: 104.4, y: 100 }]
          const action = { type: "RETRO_STAGE_PROGRESSION_COMMITTED", payload: { ideas } }

          expect(ideasReducer(initialState, action)).to.deep.equal([...ideas])
        })
      })

      context("when the payload *lacks* ideas data", () => {
        it("leaves the state unchanged", () => {
          const initialState = []
          deepFreeze(initialState)

          const action = { type: "RETRO_STAGE_PROGRESSION_COMMITTED", payload: {} }

          expect(ideasReducer(initialState, action)).to.deep.equal(initialState)
        })
      })
    })
  })
})

describe("actionCreators", () => {
  let thunk
  let mockRetroChannel

  describe("addIdea", () => {
    it("creates an action to add idea to store", () => {
      const idea = { body: "we have a linter!", category: "happy", user_id: 1 }

      expect(actionCreators.addIdea(idea)).to.deep.equal({ type: "IDEA_SUBMISSION_COMMITTED", idea })
    })
  })

  describe("submitIdea", () => {
    const idea = { body: "we have a linter!", category: "happy", user_id: 1 }

    it("returns a thunk", () => {
      const result = actionCreators.submitIdea(idea)
      expect(result).to.be.a("function")
    })

    describe("invoking the returned function", () => {
      let thunk
      let mockRetroChannel

      beforeEach(() => {
        thunk = actionCreators.submitIdea(idea)
        mockRetroChannel = setupMockRetroChannel()
        sinon.spy(mockRetroChannel, "push")
      })

      afterEach(() => {
        mockRetroChannel.push.restore()
      })

      it("results in a push to the retroChannel", () => {
        thunk(() => {}, undefined, mockRetroChannel)
        expect(mockRetroChannel.push).calledWith("idea_submitted", idea)
      })

      it("results in the dispatch of an action for optimistic-ui addition of the idea", () => {
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, undefined, mockRetroChannel)
        expect(dispatchSpy).calledWithMatch({
          type: "IDEA_SUBMISSION_SUBMITTED",
          idea,
        })
      })

      describe("when the push is successful", () => {
        it("lets the store know, noting that this particular commit was already optimistically added to the app state", () => {
          const dispatchSpy = sinon.spy()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          mockRetroChannel.__triggerReply("ok", { id: 5, arbitrary: "keyValue" })

          expect(dispatchSpy).calledWithMatch({
            type: "IDEA_SUBMISSION_COMMITTED",
            idea: { id: 5, arbitrary: "keyValue", shouldReplaceOptimisticallyAddedIdea: true },
          })
        })
      })

      describe("when the push results in an error", () => {
        it("dispatches an error", () => {
          const dispatchSpy = sinon.spy()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          mockRetroChannel.__triggerReply("error", {})

          expect(dispatchSpy).calledWithMatch({ type: "IDEA_SUBMISSION_REJECTED" })
        })
      })
    })
  })

  describe("broadcastIdeaLiveEdit", () => {
    const idea = { id: 5, x: 393.39, y: 3928.3 }

    it("returns a thunk", () => {
      const result = actionCreators.broadcastIdeaLiveEdit(idea)
      expect(result).to.be.a("function")
    })

    describe("invoking the returned function", () => {
      let thunk
      let mockRetroChannel
      let params

      const dispatchStub = () => {}
      const getStateStub = () => {}

      beforeEach(() => {
        params = { id: 5, liveEditText: "some value" }
        mockRetroChannel = { push: sinon.spy() }

        thunk = actionCreators.broadcastIdeaLiveEdit(params)

        thunk(dispatchStub, getStateStub, mockRetroChannel)
      })

      it("notifies the server, passing the params", () => {
        expect(mockRetroChannel.push).calledWith("idea_live_edit", params)
      })
    })
  })

  describe("broadcastIdeaTypingEvent", () => {
    const dumbParams = {}

    it("returns a thunk", () => {
      const result = actionCreators.broadcastIdeaTypingEvent(dumbParams)
      expect(result).to.be.a("function")
    })

    describe("invoking the returned function", () => {
      let thunk
      let mockRetroChannel
      let params

      const dispatchStub = () => {}
      const getStateStub = () => {}

      beforeEach(() => {
        params = { userToken: "azby" }
        mockRetroChannel = { push: sinon.spy() }

        thunk = actionCreators.broadcastIdeaTypingEvent(params)

        thunk(dispatchStub, getStateStub, mockRetroChannel)
      })

      it("notifies the server, passing the params", () => {
        expect(mockRetroChannel.push).calledWith("idea_typing_event", params)
      })
    })
  })

  describe("ideaDraggedInGroupingStage", () => {
    const idea = { id: 5, x: 393.39, y: 3928.3 }

    it("returns a thunk", () => {
      const result = actionCreators.ideaDraggedInGroupingStage(idea)
      expect(result).to.be.a("function")
    })

    describe("invoking the returned function", () => {
      let thunk
      let mockRetroChannel
      let dispatchSpy

      const getStateStub = () => {}

      beforeEach(() => {
        mockRetroChannel = { push: sinon.spy() }

        thunk = actionCreators.ideaDraggedInGroupingStage(idea)
        dispatchSpy = sinon.spy()

        // ensure we cancel any throttled pushes to avoid test contamination
        _throttledPushOfDragToServer.cancel()

        thunk(dispatchSpy, getStateStub, mockRetroChannel)
      })

      it("updates the local store with the idea's x y coordinates", () => {
        expect(dispatchSpy).calledWith({
          type: "IDEA_UPDATE_COMMITTED",
          ideaId: idea.id,
          newAttributes: { x: idea.x, y: idea.y, inEditState: true },
        })
      })

      it("notifies the server, passing the idea", () => {
        expect(mockRetroChannel.push).calledWith("idea_dragged_in_grouping_stage", idea)
      })

      describe("invoking it again within 40ms", () => {
        it("does not renotify the server", () => {
          expect(() => {
            thunk(dispatchSpy, getStateStub, mockRetroChannel)
          }).to.not.alter(() => {
            return mockRetroChannel.push.callCount
          })
        })
      })

      describe("when invoked multiple times in an interval", () => {
        it("doesn't save up throttled pushes to fire off in the *next* timeout", () => {
          const clock = sinon.useFakeTimers()

          // ensure throttle timeout has elapsed
          clock.tick(41)

          expect(() => {
            thunk(dispatchSpy, getStateStub, mockRetroChannel)
            thunk(dispatchSpy, getStateStub, mockRetroChannel)

            clock.tick(41)
          }).to.alter(() => {
            return mockRetroChannel.push.callCount
          }, { from: 1, to: 2 })

          clock.restore()
        })
      })
    })
  })

  describe("updateIdea", () => {
    it("creates an action to update an idea with particular id with new attributes", () => {
      const ideaId = 999
      const newAttributes = { name: "Kimberly" }

      expect(actionCreators.updateIdea(ideaId, newAttributes)).to.deep.equal({
        type: "IDEA_UPDATE_COMMITTED",
        ideaId,
        newAttributes,
      })
    })
  })

  describe("submitIdeaEditAsync", () => {
    const ideaParams = {
      id: 666,
      nonsense: "param",
      body: "chassis",
    }

    beforeEach(() => {
      thunk = actionCreators.submitIdeaEditAsync(ideaParams)
      mockRetroChannel = setupMockRetroChannel()
    })

    it("returns a thunk", () => {
      expect(typeof thunk).to.equal("function")
    })

    describe("the thunk", () => {
      const dispatchStub = () => {}
      const getStateStub = () => {}

      it("pushes—with retries—an idea_edited event, along with the idea params", () => {
        sinon.spy(mockRetroChannel, "pushWithRetries")

        thunk(dispatchStub, getStateStub, mockRetroChannel)

        expect(mockRetroChannel.pushWithRetries).calledWith("idea_edited", ideaParams)

        mockRetroChannel.pushWithRetries.restore()
      })

      it("tells the retro channel to dispatch an IDEA_UPDATE_COMMITTED action on success", () => {
        sinon.spy(mockRetroChannel, "pushWithRetries")

        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, getStateStub, mockRetroChannel)

        const onOkCallback = mockRetroChannel.pushWithRetries.getCall(0).args[2].onOk

        onOkCallback({ id: 589, derp: "herp" })

        expect(dispatchSpy).calledWithMatch({
          type: "IDEA_UPDATE_COMMITTED",
          ideaId: 589,
          newAttributes: { derp: "herp", inEditState: false, isLocalEdit: null, editSubmitted: false },
        })
      })

      it("tells the retro channel to dispatch an IDEA_UPDATE_REJECTED an error", () => {
        sinon.spy(mockRetroChannel, "pushWithRetries")
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, undefined, mockRetroChannel)

        const onErrCallback = mockRetroChannel.pushWithRetries.getCall(0).args[2].onErr

        onErrCallback()

        expect(dispatchSpy).calledWithMatch({
          type: "IDEA_UPDATE_REJECTED",
          ideaId: ideaParams.id,
          params: ideaParams,
        })
      })

      describe("when honeybadger is available (the default)", () => {
        it("notifies honeybadger of the error", () => {
          window.Honeybadger = global.Honeybadger
          sinon.spy(mockRetroChannel, "pushWithRetries")
          sinon.spy(global.Honeybadger, "notify")
          thunk(() => {}, undefined, mockRetroChannel)

          const onErrCallback = mockRetroChannel.pushWithRetries.getCall(0).args[2].onErr

          onErrCallback()

          expect(global.Honeybadger.notify).to.have.been.calledOnce
        })
      })

      describe("when honeybadger is not available due to being blocked by extensions", () => {
        it("does not blow up", () => {
          delete global.Honeybadger
          delete window.Honeybadger
          sinon.spy(mockRetroChannel, "pushWithRetries")
          thunk(() => {}, undefined, mockRetroChannel)

          const onErrCallback = mockRetroChannel.pushWithRetries.getCall(0).args[2].onErr

          expect(() => {
            onErrCallback()
          }).not.to.throw()
        })
      })

      it("lets the store know that an idea edit submission is in flight", () => {
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, getStateStub, mockRetroChannel)

        expect(dispatchSpy).calledWith({
          type: "IDEA_UPDATE_COMMITTED",
          ideaId: ideaParams.id,
          newAttributes: { editSubmitted: true },
        })
      })
    })
  })

  describe("deleteIdea", () => {
    it("creates an action to delete an idea with particular id", () => {
      const ideaId = 999

      expect(actionCreators.deleteIdea(ideaId)).to.deep.equal({
        type: "IDEA_DELETION_COMMITTED",
        ideaId,
      })
    })
  })

  describe("submitIdeaDeletionAsync", () => {
    const ideaId = 999

    beforeEach(() => {
      thunk = actionCreators.submitIdeaDeletionAsync(ideaId)
      mockRetroChannel = setupMockRetroChannel()
    })

    it("returns a thunk", () => {
      expect(typeof thunk).to.equal("function")
    })

    describe("the thunk", () => {
      const dispatchStub = () => {}
      const getStateStub = () => {}

      it("pushes a idea_deleted event to the retro channel", () => {
        sinon.spy(mockRetroChannel, "push")

        thunk(dispatchStub, getStateStub, mockRetroChannel)

        expect(mockRetroChannel.push).calledWith("idea_deleted", 999)

        mockRetroChannel.push.restore()
      })

      describe("when the push results in an error", () => {
        it("dispatches an error", () => {
          const dispatchSpy = sinon.spy()
          thunk(dispatchSpy, undefined, mockRetroChannel)

          mockRetroChannel.__triggerReply("error", {})

          expect(dispatchSpy).calledWith({ type: "IDEA_DELETION_REJECTED", ideaId: 999 })
        })
      })

      it("notifies the store that the idea has been submitted for deletion", () => {
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, getStateStub, mockRetroChannel)

        expect(dispatchSpy).calledWith({
          type: "IDEA_UPDATE_COMMITTED",
          ideaId: 999,
          newAttributes: { deletionSubmitted: true },
        })
      })
    })
  })

  describe("initiateIdeaEditState", () => {
    const ideaId = 111

    beforeEach(() => {
      thunk = actionCreators.initiateIdeaEditState(ideaId)
      mockRetroChannel = setupMockRetroChannel()
    })

    it("returns a thunk", () => {
      expect(typeof thunk).to.equal("function")
    })

    describe("the thunk", () => {
      const dispatchStub = () => {}
      const getStateStub = () => {}

      it("pushes a idea_edit_state_enabled event to the retro channel", () => {
        sinon.spy(mockRetroChannel, "push")

        thunk(dispatchStub, getStateStub, mockRetroChannel)
        expect(mockRetroChannel.push).calledWith("idea_edit_state_enabled", { id: ideaId })

        mockRetroChannel.push.restore()
      })

      it("notifies the store that the idea has entered into an edit state", () => {
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, getStateStub, mockRetroChannel)

        expect(dispatchSpy).calledWith({
          type: "IDEA_UPDATE_COMMITTED",
          ideaId,
          newAttributes: { inEditState: true, isLocalEdit: true },
        })
      })
    })
  })

  describe("cancelIdeaEditState", () => {
    const ideaId = 111

    beforeEach(() => {
      thunk = actionCreators.cancelIdeaEditState(ideaId)
      mockRetroChannel = setupMockRetroChannel()
    })

    it("returns a thunk", () => {
      expect(typeof thunk).to.equal("function")
    })

    describe("the thunk", () => {
      const dispatchStub = () => {}
      const getStateStub = () => {}

      it("pushes a idea_edit_state_disabled event to the retro channel", () => {
        sinon.spy(mockRetroChannel, "push")

        thunk(dispatchStub, getStateStub, mockRetroChannel)
        expect(mockRetroChannel.push).calledWith("idea_edit_state_disabled", { id: ideaId })

        mockRetroChannel.push.restore()
      })

      it("notifies the store that the idea has left the edit state", () => {
        const dispatchSpy = sinon.spy()
        thunk(dispatchSpy, getStateStub, mockRetroChannel)

        expect(dispatchSpy).calledWith({
          type: "IDEA_UPDATE_COMMITTED",
          ideaId,
          newAttributes: {
            inEditState: false,
            liveEditText: null,
            isLocalEdit: null,
            editSubmitted: false,
          },
        })
      })
    })
  })
})
