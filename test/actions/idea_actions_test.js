import { expect } from "chai"

import * as actionCreators from "../../web/static/js/actions/idea"

describe("addIdea", () => {
  it("creates an action to add idea to store", () => {
    const idea = { body: "we have a linter!", category: "happy", author: "Kimberly Suazo" }

    expect(actionCreators.addIdea(idea)).to.deep.equal({ type: "ADD_IDEA", idea })
  });
});
