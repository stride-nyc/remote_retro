import React from "react"
import sinon from "sinon"

import IdeaList from "../../web/static/js/components/idea_list"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, ACTION_ITEMS, CLOSED } = STAGES

describe("IdeaList", () => {
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const defaultProps = {
    currentUser: { given_name: "daniel" },
    retroChannel: mockRetroChannel,
    votes: [],
    ideas: [],
    stage: IDEA_GENERATION,
    category: "confused",
    alert: null,
  }

  context("when the stage is either idea-generation or voting stage", () => {
    const ideas = [{
      id: 5,
      body: "should be third",
      category: "confused",
    }, {
      id: 2,
      body: "should be first",
      category: "confused",
    }, {
      id: 4,
      body: "should be second",
      category: "confused",
    }]

    it("renders ideas sorted by id ascending", () => {
      const ideaGenerationStageWrapper = mountWithConnectedSubcomponents(
        <IdeaList
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
        <IdeaList
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
      }, {
        id: 2,
        body: "should be first based on votes",
        category: "confused",
      }, {
        id: 1,
        body: "should be second based on votes",
        category: "confused",
      }]

      const votes = [
        { idea_id: 2 },
        { idea_id: 2 },
        { idea_id: 1 },
      ]

      it("renders them sorted by vote count descending", () => {
        const actionItemsStageWrapper = mountWithConnectedSubcomponents(
          <IdeaList
            {...defaultProps}
            ideas={ideas}
            votes={votes}
            stage={ACTION_ITEMS}
          />
        )

        const actionItemDistributionStageWrapper = mountWithConnectedSubcomponents(
          <IdeaList
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

      it("passes disableAllAnimations: false to the FlipMove component", () => {
        const actionItemsStageWrapper = mountWithConnectedSubcomponents(
          <IdeaList
            {...defaultProps}
            ideas={ideas}
            votes={votes}
            stage={CLOSED}
          />
        )

        const flipMove = actionItemsStageWrapper.find("FlipMove")
        expect(flipMove.prop("disableAllAnimations")).to.equal(false)
      })

      context("when ideas have an identical vote count", () => {
        const ideas = [{
          id: 5,
          body: "should be second based on voting tie and a lower id",
          category: "confused",
        }, {
          id: 2,
          body: "should be first based on voting tie and a higher id",
          category: "confused",
        }, {
          id: 1,
          body: "should be third based on lack of votes",
          category: "confused",
        }]

        const votes = [
          { idea_id: 2 },
          { idea_id: 5 },
        ]

        it("does a secondary sort on id ascending", () => {
          const wrapper = mountWithConnectedSubcomponents(
            <IdeaList
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
      }, {
        id: 2,
        body: "should be second based on id",
        category: "action-item",
      }, {
        id: 1,
        body: "should be first based on id",
        category: "action-item",
      }]

      it("renders them sorted by id ascending", () => {
        const actionItemsStageWrapper = mountWithConnectedSubcomponents(
          <IdeaList
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

      it("passes disableAllAnimations: true to the FlipMove component", () => {
        const actionItemsStageWrapper = mountWithConnectedSubcomponents(
          <IdeaList
            {...defaultProps}
            ideas={ideas}
            category="action-item"
            stage={ACTION_ITEMS}
          />
        )

        const flipMove = actionItemsStageWrapper.find("FlipMove")
        expect(flipMove.prop("disableAllAnimations")).to.equal(true)
      })
    })
  })

  context("when the stage is transitioned from voting to action-items", () => {
    context("and the alert is cleared", () => {
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
        vote_count: 16,
      }, {
        id: 2,
        body: "should be first at outset",
        category: "confused",
        vote_count: 1,
      }]

      const votes = [{ idea_id: 5 }]

      it("alters the sort order to most votes DESC after a delay", () => {
        const wrapper = mountWithConnectedSubcomponents(
          <IdeaList
            {...defaultProps}
            votes={votes}
            ideas={ideas}
            stage={VOTING}
            alert={null}
          />
        )

        wrapper.setProps({ stage: ACTION_ITEMS, alert: { headerText: "Stage Change: Action Items" } })
        let listItems = wrapper.find("li")
        expect(listItems.first().text()).to.match(/should be first at outset/)
        wrapper.setProps({ alert: null })

        clock.tick(2250)
        wrapper.update()
        listItems = wrapper.find("li")
        expect(listItems.first().text()).to.match(/should be first after brief delay/)
      })
    })
  })
})
