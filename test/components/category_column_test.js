import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import CategoryColumn from "../../web/static/js/components/category_column"

describe("CategoryColumn", () => {
  it("is renders a list item for each idea in the ideas prop", () => {
    const ideas = [{
      body: ":confused: what happened to our CI server?"
    }, {
      body: ":sad: still no word on tests"
    }]

    const wrapper = shallow(<CategoryColumn ideas={ideas} category="happy"/>)
    expect(wrapper.find("li")).to.have.length(2)
  })
})
