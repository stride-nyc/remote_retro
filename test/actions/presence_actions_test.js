import * as actionCreators from "../../web/static/js/actions/presence"

describe("setPresences", () => {
  const presences = [{ given_name: "Tiny Rick" }]

  it("should create an action to add presence to presences list", () => {
    expect(actionCreators.setPresences(presences)).to.deep.equal({ type: "SET_PRESENCES", presences })
  })
})

describe("updatePresence", () => {
  const presenceToken = "abcde12345"
  const newAttributes = { age: 170 }

  it("should create an action to update a given presence's attributes in presences", () => {
    expect(actionCreators.updatePresence(presenceToken, newAttributes)).to.deep.equal({ type: "UPDATE_PRESENCE", presenceToken, newAttributes })
  })
})

describe("syncPresenceDiff", () => {
  const presenceDiff = {
    joins: {
      someUserToken: { user: { name: "Timmy", age: 29 } },
    },
    leaves: {
      someOtherUserToken: { user: { name: "Travis", age: 30 } },
    },
  }

  it("returns a `SYNC_PRESENCE_DIFF` action", () => {
    expect(actionCreators.syncPresenceDiff(presenceDiff).type).to.equal("SYNC_PRESENCE_DIFF")
  })

  it("passes along the given presence diff", () => {
    const action = actionCreators.syncPresenceDiff(presenceDiff)
    expect(action.presenceDiff).to.deep.equal(presenceDiff)
  })
})

