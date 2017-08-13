import React from "react"
import { shallow, mount } from "enzyme"

import CategoryColumn from "../../web/static/js/components/category_column"
import Idea from "../../web/static/js/components/idea"

describe("CategoryColumn", () => {
  const mockUser = { given_name: "daniel" }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const ideaGenerationStage = "idea-generation"

  describe("when the ideas passed in are in no discernable order", () => {
    const ideas = [{
      id: 5,
      body: "should be third",
      category: "confused",
      user: mockUser,
    }, {
      id: 2,
      body: "should be first",
      category: "confused",
      user: mockUser,
    }, {
      id: 4,
      body: "should be second",
      category: "confused",
      user: mockUser,
    }]

    it("it renders them sorted by id ascending", () => {
      const wrapper = mount(
        <CategoryColumn
          ideas={ideas}
          category="confused"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
          stage={ideaGenerationStage}
        />
      )

      const listItems = wrapper.find("li")
      expect(listItems.first().text()).to.match(/should be first/)
      expect(listItems.at(1).text()).to.match(/should be second/)
      expect(listItems.at(2).text()).to.match(/should be third/)
    })
  })

  describe("when every idea passed in the ideas prop matches the column's category", () => {
    it("renders a list item for each idea passed the ideas prop", () => {
      const ideas = [{
        id: 1,
        body: "tests!",
        category: "happy",
        user: mockUser,
      }, {
        id: 2,
        body: "winter break!",
        category: "happy",
        user: mockUser,
      }]

      const wrapper = shallow(
        <CategoryColumn
          ideas={ideas}
          category="happy"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
          stage={ideaGenerationStage}
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
        user: mockUser,
      }]

      const differentCategory = "happy"
      const wrapper = shallow(
        <CategoryColumn
          ideas={ideas}
          category={differentCategory}
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
          stage={ideaGenerationStage}
        />
      )

      expect(wrapper.text()).not.to.match(/still no word on tests/)
    })
  })
})
