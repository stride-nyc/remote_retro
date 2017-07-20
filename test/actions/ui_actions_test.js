import * as actionCreators from "../../web/static/js/actions/ui"

describe("toggleSubmitIdeaPromptPointer", () => {
  it("creates an action to toggle the visibility of the submit idea prompt pointer", () => {
    expect(actionCreators.toggleSubmitIdeaPromptPointer(true)).to.deep.equal({
      type: "TOGGLE_SUBMIT_IDEA_PROMPT_POINTER",
      value: true,
    })
  })
})
