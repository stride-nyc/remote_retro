import { expect } from "chai"

import * as actionCreators from "../../web/static/js/actions/user"

describe("addUsers", () => {
  const users = [{ given_name: "Tiny Rick" }]

  it("should create an action to add user to users list", () => {
    expect(actionCreators.addUsers(users)).to.deep.equal({ type: "ADD_USERS", users })
  })
})
