import * as actionCreators from "../../web/static/js/actions/user"

describe("addUsers", () => {
  const users = [{ given_name: "Tiny Rick" }]

  it("should create an action to add user to users list", () => {
    expect(actionCreators.addUsers(users)).to.deep.equal({ type: "ADD_USERS", users })
  })
})

describe("updateUser", () => {
  const userToken = "abcde12345"
  const newAttributes = { age: 170 }

  it("should create an action to update a given user's attributes in users", () => {
    expect(actionCreators.updateUser(userToken, newAttributes)).to.deep.equal({ type: "UPDATE_USER", userToken, newAttributes })
  });
})
