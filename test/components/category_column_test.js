import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import CategoryColumn from "../../web/static/js/components/category_column"
import Idea from "../../web/static/js/components/idea"

describe("CategoryColumn", () => {
  const mockPresence = { user: { given_name: "daniel" } }

  describe("when every idea passed in the ideas prop matches the column's category", () => {
    it("renders a list item for each idea passed the ideas prop", () => {
      const ideas = [{
        id: 1,
        body: "tests!",
        category: "happy",
      }, {
        id: 2,
        body: "winter break!",
        category: "happy",
      }]

      const wrapper = shallow(
        <CategoryColumn ideas={ideas} category="happy" currentPresence={mockPresence} />
      )
      expect(wrapper.find(Idea)).to.have.length(2)
    })
  })

  describe("when an idea passed in the ideas prop fails to match the column's category", () => {
    it("is not rendered", () => {
      const ideas = [{
        id: 1,
        body: "still no word on tests",
        category: "confused",
      }]

      const differentCategory = "happy"
      const wrapper = shallow(
        <CategoryColumn
          ideas={ideas}
          category={differentCategory}
          currentPresence={mockPresence}
        />
      )

      expect(wrapper.text()).not.to.match(/still no word on tests/)
    })
  })
})
