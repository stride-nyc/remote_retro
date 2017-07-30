import * as actionCreators from "../../web/static/js/actions/alert"

describe("clearAlert", () => {
  it("creates an action to clear the alert", () => {
    expect(actionCreators.clearAlert()).to.deep.equal({ type: "CLEAR_ALERT" })
  })
})
