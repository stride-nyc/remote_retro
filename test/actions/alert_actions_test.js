import * as actionCreators from "../../web/static/js/actions/alert"

describe("clearAlert", () => {
  it("creates an action to clear the alert", () => {
    expect(actionCreators.clearAlert()).to.deep.equal({ type: "CLEAR_ALERT" })
  })
})

describe("changeFacilitator", () => {
  it("creates an action to change alert text to facilitation transfer info", () => {
    const previousFacilitatorName = "Jane"
    expect(actionCreators.changeFacilitator(previousFacilitatorName)).to.deep.equal({ type: "CHANGE_FACILITATOR", previousFacilitatorName })
  })
})
