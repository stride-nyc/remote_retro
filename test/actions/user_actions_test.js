import { expect } from "chai"

import * as actionCreators from "../../web/static/js/actions/user"

describe("addUser", () => {
  const user = { given_name: "Tiny Rick" }

  it("should create an action to add user to users list", () => {
    expect(actionCreators.addUser(user)).to.deep.equal({ type: "ADD_USER", user })
  })
})
