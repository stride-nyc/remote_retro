import * as actionCreators from "../../web/static/js/actions/user"

describe("setUsers", () => {
  const users = [{ given_name: "Tiny Rick" }]

  it("should create an action to add user to users list", () => {
    expect(actionCreators.setUsers(users)).to.deep.equal({ type: "SET_USERS", users })
  })
})

describe("updatePresence", () => {
  const userToken = "abcde12345"
  const newAttributes = { age: 170 }

  it("should create an action to update a given user's attributes in users", () => {
    expect(actionCreators.updatePresence(userToken, newAttributes)).to.deep.equal({ type: "UPDATE_PRESENCE", userToken, newAttributes })
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

