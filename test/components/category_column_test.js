import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import CategoryColumn from "../../web/static/js/components/category_column"

describe("CategoryColumn", () => {
  describe("when every idea passed in the ideas prop matches the column's category", () => {
    it("is renders a list item for each idea passed the ideas prop", () => {
      const ideas = [{
        body: "tests!",
        category: "happy",
      }, {
        body: "winter break!",
        category: "happy",
      }]

      const wrapper = shallow(<CategoryColumn ideas={ideas} category="happy" />)
      expect(wrapper.find("li")).to.have.length(2)
    })
  })

  describe("when an idea passed in the ideas prop fails to match the column's category", () => {
    it("is not rendered", () => {
      const ideas = [{
        body: "still no word on tests",
        category: "confused",
      }]

      const differentCategory = "happy"
      const wrapper = shallow(<CategoryColumn ideas={ideas} category={differentCategory} />)
      expect(wrapper.text()).not.to.match(/still no word on tests/)
    })
  })
})
