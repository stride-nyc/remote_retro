import * as actionCreators from "../../web/static/js/actions/idea"

describe("addIdea", () => {
  it("creates an action to add idea to store", () => {
    const idea = { body: "we have a linter!", category: "happy", author: "Kimberly Suazo" }

    expect(actionCreators.addIdea(idea)).to.deep.equal({ type: "ADD_IDEA", idea })
  })
})

describe("updateIdea", () => {
  it("creates an action to update an idea with particular id with new attributes", () => {
    const ideaId = 999
    const newAttributes = { name: "Kimberly" }

    expect(actionCreators.updateIdea(ideaId, newAttributes)).to.deep.equal({
      type: "UPDATE_IDEA",
      ideaId,
      newAttributes,
    })
  })
})

describe("deleteIdea", () => {
  it("creates an action to delete an idea with particular id", () => {
    const ideaId = 999

    expect(actionCreators.deleteIdea(ideaId)).to.deep.equal({
      type: "DELETE_IDEA",
      ideaId,
    })
  })
})

