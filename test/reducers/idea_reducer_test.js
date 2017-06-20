import deepFreeze from "deep-freeze"

import ideaReducer from "../../web/static/js/reducers/idea"

describe("idea reducer", () => {
  describe("when an action is nonexistent or unhandled", () => {
    describe("and there is no initial state", () => {
      it("should return an empty array", () => {
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(ideaReducer(undefined, {})).to.deep.equal([])
        expect(ideaReducer(undefined, unhandledAction)).to.deep.equal([])
      })
    })

    describe("and there is initial state", () => {
      it("should return that initial state", () => {
        const initialState = [{ body: "we have a linter!", category: "happy", author: "Kimberly Suazo" }]
        const unhandledAction = { type: "IHAVENOIDEAWHATSHAPPENING" }

        expect(ideaReducer(initialState, {})).to.deep.equal(initialState)
        expect(ideaReducer(initialState, unhandledAction)).to.deep.equal(initialState)
      })
    })
  })

  describe("the handled actions", () => {
    describe("when the action is ADD_IDEA", () => {
      it("should add an idea to list of ideas", () => {
        const initialState = [{ body: "i'm an old idea!", category: "happy", author: "Morty" }]
        deepFreeze(initialState)
        const idea = { body: "we have a linter!", category: "happy", author: "Kimberly Suazo" }
        const action = { type: "ADD_IDEA", idea }

        expect(ideaReducer(initialState, action)).to.deep.equal([...initialState, idea])
      })
    })

    describe("when the action is SET_IDEAS", () => {
      it("should replace the state with the ideas passed in the action", () => {
        const initialIdeas = [{ body: "i'm an old idea!", category: "happy", author: "Morty" }]
        deepFreeze(initialIdeas)

        const ideas = [{ body: "modern convenience", category: "confused", author: "Kimberly Suazo" }]
        const action = { type: "SET_IDEAS", ideas }

        expect(ideaReducer(initialIdeas, action)).to.deep.equal([...ideas])
      })
    })

    describe("when the action is SET_INITIAL_STATE", () => {
      it("should replace the state with the ideas passed in the action's inialState object", () => {
        const initialIdeas = [{ body: "i'm an old idea!", category: "happy", author: "Morty" }]
        deepFreeze(initialIdeas)

        const newIdeas = [{ body: "modern convenience", category: "confused", author: "Kimberly Suazo" }]
        const action = { type: "SET_INITIAL_STATE", initialState: { ideas: newIdeas } }

        expect(ideaReducer(initialIdeas, action)).to.deep.equal([...newIdeas])
      })
    })

    describe("when the action is UPDATE_IDEA", () => {
      const initialIdeas = [{ id: 666, category: "happy", author: "Kimberly" }, { id: 22, category: "n/a", author: "Travis" }]
      deepFreeze(initialIdeas)

      it("returns an updated set of ideas, where the idea with matching id has updated attributes", () => {
        const action = { type: "UPDATE_IDEA", ideaId: 666, newAttributes: { category: "sad" } }
        expect(ideaReducer(initialIdeas, action)).to.deep.equal([
          { id: 666, category: "sad", author: "Kimberly" },
          { id: 22, category: "n/a", author: "Travis" },
        ])
      })
    })

    describe("when the action is DELETE_IDEA", () => {
      const initialIdeas = [{ id: 667, category: "happy", author: "Kimberly" }, { id: 22, category: "n/a", author: "Travis" }]
      deepFreeze(initialIdeas)

      it("returns an updated set of ideas, where the idea with matching id has been removed", () => {
        const action = { type: "DELETE_IDEA", ideaId: 667 }
        expect(ideaReducer(initialIdeas, action)).to.deep.equal([
          { id: 22, category: "n/a", author: "Travis" },
        ])
      })
    })
  })
})
