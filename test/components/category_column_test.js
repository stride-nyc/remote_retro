import React from "react"
import { shallow } from "enzyme"
import sinon, { spy, stub } from "sinon"

import { CategoryColumn } from "../../web/static/js/components/category_column"
import Idea from "../../web/static/js/components/idea"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, ACTION_ITEMS, CLOSED } = STAGES

describe("CategoryColumn", () => {
  const mockUser = { given_name: "daniel" }
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const defaultProps = {
    currentUser: mockUser,
    retroChannel: mockRetroChannel,
    votes: [],
    ideas: [],
    stage: IDEA_GENERATION,
    category: "confused",
  }

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

    it("renders ideas sorted by id ascending", () => {
      const ideaGenerationStageWrapper = mountWithConnectedSubcomponents(
        <CategoryColumn
          {...defaultProps}
          ideas={ideas}
          category="confused"
          stage={IDEA_GENERATION}
        />
      )

      const ideaGenerationListItems = ideaGenerationStageWrapper.find("li")
      expect(ideaGenerationListItems.first().text()).to.match(/should be first/)
      expect(ideaGenerationListItems.at(1).text()).to.match(/should be second/)
      expect(ideaGenerationListItems.at(2).text()).to.match(/should be third/)

      const votingStageWrapper = mountWithConnectedSubcomponents(
        <CategoryColumn
          {...defaultProps}
          ideas={ideas}
          stage={VOTING}
        />
      )

      const votingStageListItems = votingStageWrapper.find("li")
      expect(votingStageListItems.first().text()).to.match(/should be first/)
      expect(votingStageListItems.at(1).text()).to.match(/should be second/)
      expect(votingStageListItems.at(2).text()).to.match(/should be third/)
    })
  })

  context("when the stage is action-items or closed from the outset", () => {
    context("when the category is anything *other* than action-items", () => {
      const ideas = [{
        id: 5,
        body: "should be third based on votes",
        category: "confused",
        user: mockUser,
      }, {
        id: 2,
        body: "should be first based on votes",
        category: "confused",
        user: mockUser,
      }, {
        id: 1,
        body: "should be second based on votes",
        category: "confused",
        user: mockUser,
      }]

      const votes = [
        { idea_id: 2 },
        { idea_id: 2 },
        { idea_id: 1 },
      ]

      it("renders them sorted by vote count descending", () => {
        const actionItemsStageWrapper = mountWithConnectedSubcomponents(
          <CategoryColumn
            {...defaultProps}
            ideas={ideas}
            votes={votes}
            stage={ACTION_ITEMS}
          />
        )

        const actionItemDistributionStageWrapper = mountWithConnectedSubcomponents(
          <CategoryColumn
            {...defaultProps}
            ideas={ideas}
            votes={votes}
            stage={CLOSED}
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

      context("when ideas have an identical vote count", () => {
        const ideas = [{
          id: 5,
          body: "should be second based on voting tie and a lower id",
          category: "confused",
          user: mockUser,
        }, {
          id: 2,
          body: "should be first based on voting tie and a higher id",
          category: "confused",
          user: mockUser,
        }, {
          id: 1,
          body: "should be third based on lack of votes",
          category: "confused",
          user: mockUser,
        }]

        const votes = [
          { idea_id: 2 },
          { idea_id: 5 },
        ]

        it("does a secondary sort on id ascending", () => {
          const wrapper = mountWithConnectedSubcomponents(
            <CategoryColumn
              {...defaultProps}
              ideas={ideas}
              votes={votes}
              stage={ACTION_ITEMS}
            />
          )

          const listItems = wrapper.find("li")
          expect(listItems.first().text()).to.match(/should be first/)
          expect(listItems.at(1).text()).to.match(/should be second/)
          expect(listItems.at(2).text()).to.match(/should be third/)
        })
      })
    })

    context("when the category is 'action-items'", () => {
      const ideas = [{
        id: 5,
        body: "should be third based on id",
        category: "action-item",
        user: mockUser,
      }, {
        id: 2,
        body: "should be second based on id",
        category: "action-item",
        user: mockUser,
      }, {
        id: 1,
        body: "should be first based on id",
        category: "action-item",
        user: mockUser,
      }]

      it("renders them sorted by id ascending", () => {
        const actionItemsStageWrapper = mountWithConnectedSubcomponents(
          <CategoryColumn
            {...defaultProps}
            ideas={ideas}
            category="action-item"
            stage={ACTION_ITEMS}
          />
        )

        const listItemsDuringActionItemsStage = actionItemsStageWrapper.find("li")
        expect(listItemsDuringActionItemsStage.first().text()).to.match(/should be first/)
        expect(listItemsDuringActionItemsStage.at(1).text()).to.match(/should be second/)
        expect(listItemsDuringActionItemsStage.at(2).text()).to.match(/should be third/)
      })
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

    const votes = [{ idea_id: 5 }]

    it("alters the sort order to most votes DESC after a delay", () => {
      const wrapper = mountWithConnectedSubcomponents(
        <CategoryColumn
          {...defaultProps}
          votes={votes}
          ideas={ideas}
          stage={VOTING}
        />
      )

      wrapper.setProps({ stage: ACTION_ITEMS })
      let listItems = wrapper.find("li")
      expect(listItems.first().text()).to.match(/should be first at outset/)

      clock.tick(2250)
      wrapper.update()
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
          {...defaultProps}
          ideas={ideas}
          category="happy"
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
          {...defaultProps}
          ideas={ideas}
          category={differentCategory}
        />
      )

      expect(wrapper.text()).not.to.match(/still no word on tests/)
    })
  })

  context("when an item is dragged over it", () => {
    const mockEvent = { preventDefault: spy(), dataTransfer: { dropEffect: null } }

    before(() => {
      const wrapper = shallow(
        <CategoryColumn
          {...defaultProps}
        />
      )

      wrapper.simulate("dragOver", mockEvent)
    })

    it("prevents the default event behavior", () => {
      expect(mockEvent.preventDefault.called).to.eql(true)
    })

    it("sets the accepted event dropEffect to 'move'", () => {
      expect(mockEvent.dataTransfer.dropEffect).to.eql("move")
    })
  })

  context("when an item is dropped on it", () => {
    const ideaBody = "sup"
    const ideaId = 100
    const mockEvent = {
      preventDefault: spy(),
      dataTransfer: {
        getData: stub(),
      },
    }
    mockEvent.dataTransfer.getData.withArgs("ideaId").returns(ideaId).withArgs("ideaBody").returns(ideaBody)
    const mockRetroChannel = { push: spy() }
    const category = "sad"

    before(() => {
      const wrapper = shallow(
        <CategoryColumn
          {...defaultProps}
          category={category}
          retroChannel={mockRetroChannel}
        />
      )

      wrapper.simulate("drop", mockEvent)
    })

    it("prevents the default event behavior", () => {
      expect(mockEvent.preventDefault.called).to.eql(true)
    })

    it("pushes the idea_edited event with the idea id, body and new category", () => {
      expect(mockRetroChannel.push.calledWith("idea_edited", {
        id: ideaId,
        body: ideaBody,
        category,
      })).to.eql(true)
    })
  })
})
