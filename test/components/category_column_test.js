import React from "react"
import { shallow, mount } from "enzyme"

import CategoryColumn from "../../web/static/js/components/category_column"
import Idea from "../../web/static/js/components/idea"

describe("CategoryColumn", () => {
  const mockUser = { given_name: "daniel" }
  const mockRetroChannel = { on: () => {}, push: () => {} }

  describe("when the ideas passed in are in no discernable order based on timestamp", () => {
    const ideas = [{
      id: 1,
      body: "still no word on tests",
      category: "confused",
      inserted_at: "2017-05-01T02:52:00",
    }, {
      id: 5,
      body: "should be first",
      category: "confused",
      inserted_at: "2017-05-01T02:51:00",
    }, {
      id: 6,
      body: "still no word on tests",
      category: "confused",
      inserted_at: "2017-05-01T02:53:00",
    }]

    it("it renders them sorted by timestamp ascending", () => {
      const wrapper = mount(
        <CategoryColumn
          ideas={ideas}
          category="confused"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
        />
      )

      expect(wrapper.find("li").first().text()).to.match(/should be first/)
    })
  })

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
        <CategoryColumn
          ideas={ideas}
          category="happy"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
        />
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
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
        />
      )

      expect(wrapper.text()).not.to.match(/still no word on tests/)
    })
  })
})
