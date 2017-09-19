import React from "react"
import { shallow, mount } from "enzyme"
import sinon from "sinon"

import CategoryColumn from "../../web/static/js/components/category_column"
import Idea from "../../web/static/js/components/idea"

describe("CategoryColumn", () => {
  const mockUser = { given_name: "daniel" }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const ideaGenerationStage = "idea-generation"
  const actionItemStage = "action-items"
  const actionItemDistributionStage = "closed"
  const votingStage = "voting"

  context("when the stage is either idea-generation or voting stage", () => {
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
      const ideaGenerationStageWrapper = mount(
        <CategoryColumn
          ideas={ideas}
          category="confused"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
          stage={ideaGenerationStage}
        />
      )

      const ideaGenerationListItems = ideaGenerationStageWrapper.find("li")
      expect(ideaGenerationListItems.first().text()).to.match(/should be first/)
      expect(ideaGenerationListItems.at(1).text()).to.match(/should be second/)
      expect(ideaGenerationListItems.at(2).text()).to.match(/should be third/)

      const votingStageWrapper = mount(
        <CategoryColumn
          ideas={ideas}
          category="confused"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
          stage={votingStage}
        />
      )

      const votingStageListItems = votingStageWrapper.find("li")
      expect(votingStageListItems.first().text()).to.match(/should be first/)
      expect(votingStageListItems.at(1).text()).to.match(/should be second/)
      expect(votingStageListItems.at(2).text()).to.match(/should be third/)
    })
  })

  context("when the stage is action-items or closed from the outset", () => {
    const ideas = [{
      id: 5,
      body: "should be third",
      category: "confused",
      user: mockUser,
      vote_count: 1,
    }, {
      id: 2,
      body: "should be first",
      category: "confused",
      user: mockUser,
      vote_count: 16,
    }, {
      id: 4,
      body: "should be second",
      category: "confused",
      user: mockUser,
      vote_count: 12,
    }]

    it("it renders them sorted by vote_count descending", () => {
      const actionItemsStageWrapper = mount(
        <CategoryColumn
          ideas={ideas}
          category="confused"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
          stage={actionItemStage}
        />
      )

      const actionItemDistributionStageWrapper = mount(
        <CategoryColumn
          ideas={ideas}
          category="confused"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
          stage={actionItemDistributionStage}
        />
      )

      const listItemsDuringActionItemsStage = actionItemsStageWrapper.find("li")
      expect(listItemsDuringActionItemsStage.first().text()).to.match(/should be first/)
      expect(listItemsDuringActionItemsStage.at(1).text()).to.match(/should be second/)
      expect(listItemsDuringActionItemsStage.at(2).text()).to.match(/should be third/)

      const listItemsDuringActionItemDistribution = actionItemDistributionStageWrapper.find("li")
      expect(listItemsDuringActionItemDistribution.first().text()).to.match(/should be first/)
      expect(listItemsDuringActionItemDistribution.at(1).text()).to.match(/should be second/)
      expect(listItemsDuringActionItemDistribution.at(2).text()).to.match(/should be third/)
    })
  })

  context("when the stage is transitioned from voting to action-items", () => {
    let clock

    beforeEach(() => {
      clock = sinon.useFakeTimers()
    })

    afterEach(() => {
      clock.restore()
    })

    const ideas = [{
      id: 5,
      body: "should be first after brief delay",
      category: "confused",
      user: mockUser,
      vote_count: 16,
    }, {
      id: 2,
      body: "should be first at outset",
      category: "confused",
      user: mockUser,
      vote_count: 1,
    }]

    it("alters the sort order to most votes DESC after a delay", () => {
      const wrapper = mount(
        <CategoryColumn
          ideas={ideas}
          category="confused"
          currentUser={mockUser}
          retroChannel={mockRetroChannel}
          stage={votingStage}
        />
      )

      wrapper.setProps({ stage: actionItemStage })
      let listItems = wrapper.find("li")
      expect(listItems.first().text()).to.match(/should be first at outset/)

      clock.tick(2250)
      listItems = wrapper.find("li")
      expect(listItems.first().text()).to.match(/should be first after brief delay/)
    })
  })

  context("when every idea passed in the ideas prop matches the column's category", () => {
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

  context("when an idea passed in the ideas prop fails to match the column's category", () => {
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
