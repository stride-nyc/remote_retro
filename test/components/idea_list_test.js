import React from "react"

import IdeaList from "../../web/static/js/components/idea_list"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, ACTION_ITEMS, CLOSED } = STAGES

describe("IdeaList", () => {
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const defaultProps = {
    currentUser: { given_name: "daniel", is_facilitator: true },
    isTabletOrAbove: false,
    retroChannel: mockRetroChannel,
    ideaGenerationCategories: [],
    votes: [],
    ideas: [],
    stage: IDEA_GENERATION,
    category: "confused",
    alert: null,
  }

  context("when the stage is either idea-generation or voting stage", () => {
    [IDEA_GENERATION, VOTING].forEach(stage => {
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
            stage={stage}
          />
        )

        const ideaGenerationListItemsHtml = ideaGenerationStageWrapper.html()
        expect(ideaGenerationListItemsHtml).to.match(
          /should be first.*should be second.*should be third/
        )
      })
    })
  })

  context("when the stage is action-items or closed from the outset", () => {
    context("when the category is anything *other* than action-items", () => {
      [ACTION_ITEMS, CLOSED].forEach(stage => {
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
          const wrapper = mountWithConnectedSubcomponents(
            <IdeaList
              {...defaultProps}
              ideas={ideas}
              votes={votes}
              stage={stage}
            />
          )

          const ideaGenerationListItemsHtml = wrapper.html()
          expect(ideaGenerationListItemsHtml).to.match(
            /should be first.*should be second.*should be third/
          )
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

            const listItemsHtml = wrapper.html()
            expect(listItemsHtml).to.match(
              /should be first.*should be second.*should be third/
            )
          })
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

        const listItemsHtml = actionItemsStageWrapper.html()
        expect(listItemsHtml).to.match(
          /should be first.*should be second.*should be third/
        )
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
      const ideas = [{
        id: 5,
        body: "should be first after stage change alert removed",
        category: "confused",
        vote_count: 16,
      }, {
        id: 2,
        body: "should be first at outset",
        category: "confused",
        vote_count: 1,
      }]

      const votes = [{ idea_id: 5 }]

      it("alters the sort order to most votes DESC", () => {
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

        listItems = wrapper.find("li")
        expect(listItems.first().text()).to.match(/should be first after stage change alert removed/)
      })
    })
  })
})
