import React from "react"
import { shallow } from "enzyme"

import IdeaColumnListContainer from "../../web/static/js/components/idea_column_list_container"
import IdeaList from "../../web/static/js/components/idea_list"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION, VOTING, ACTION_ITEMS, CLOSED } = STAGES

describe("IdeaColumnListContainer", () => {
  const defaultProps = {
    currentUser: { given_name: "daniel", is_facilitator: true },
    isTabletOrAbove: false,
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

      it("sorts the ideas passed to IdeaList by id ascending", () => {
        const ideaGenerationStageWrapper = shallow(
          <IdeaColumnListContainer
            {...defaultProps}
            ideas={ideas}
            category="confused"
            stage={stage}
          />
        )

        const ideaListContainer = ideaGenerationStageWrapper.find(IdeaList)
        const ideaBodies = ideaListContainer.prop("ideas").map(ideaList => ideaList.body)
        expect(ideaBodies).to.eql([
          "should be first",
          "should be second",
          "should be third",
        ])
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

        it("sorts the ideas passed to IdeaList by vote count descending", () => {
          const wrapper = shallow(
            <IdeaColumnListContainer
              {...defaultProps}
              ideas={ideas}
              votes={votes}
              stage={stage}
            />
          )

          const ideaListContainer = wrapper.find(IdeaList)
          const ideaBodies = ideaListContainer.prop("ideas").map(ideaList => ideaList.body)
          expect(ideaBodies).to.eql([
            "should be first based on votes",
            "should be second based on votes",
            "should be third based on votes",
          ])
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
          it("sorts the ideas passed to IdeaList with a secondary sort on id ascending", () => {
            const wrapper = shallow(
              <IdeaColumnListContainer
                {...defaultProps}
                ideas={ideas}
                votes={votes}
                stage={ACTION_ITEMS}
              />
            )

            const ideaListContainer = wrapper.find(IdeaList)
            const ideaBodies = ideaListContainer.prop("ideas").map(ideaList => ideaList.body)
            expect(ideaBodies).to.eql([
              "should be first based on voting tie and a higher id",
              "should be second based on voting tie and a lower id",
              "should be third based on lack of votes",
            ])
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

      it("sorts the ideas passed to IdeaList by id ascending", () => {
        const actionItemsStageWrapper = shallow(
          <IdeaColumnListContainer
            {...defaultProps}
            ideas={ideas}
            category="action-item"
            stage={ACTION_ITEMS}
          />
        )

        const ideaListContainer = actionItemsStageWrapper.find(IdeaList)
        const ideaBodies = ideaListContainer.prop("ideas").map(ideaList => ideaList.body)
        expect(ideaBodies).to.eql([
          "should be first based on id",
          "should be second based on id",
          "should be third based on id",
        ])
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
          <IdeaColumnListContainer
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
