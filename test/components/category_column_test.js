import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"

import CategoryColumn from "../../web/static/js/components/category_column"
import IdeaListItem from "../../web/static/js/components/idea_list_item"

describe("CategoryColumn", () => {
  const stubbedPresence = { user: { given_name: "daniel" } }

  describe("when every idea passed in the ideas prop matches the column's category", () => {
    it("is renders a list item for each idea passed the ideas prop", () => {
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
        <CategoryColumn ideas={ideas} category="happy" currentPresence={stubbedPresence} />
      )
      expect(wrapper.find(IdeaListItem)).to.have.length(2)
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
          currentPresence={stubbedPresence}
        />
      )

      expect(wrapper.text()).not.to.match(/still no word on tests/)
    })
  })
})
