import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import IdeaColumnListContainer from "../../web/static/js/components/idea_column_list_container"
import IdeaList from "../../web/static/js/components/idea_list"
import STAGES from "../../web/static/js/configs/stages"

// Mock IdeaList component to verify props
jest.mock("../../web/static/js/components/idea_list", () => {
  const mockIdeaList = jest.fn(props => {
    // Store the props for testing
    mockIdeaList.mockProps = props
    return (
      <div data-testid="idea-list">
        {props.ideasSorted.map(idea => <li key={idea.id}>{idea.body}</li>)}
      </div>
    )
  })
  return mockIdeaList
})

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

  beforeEach(() => {
    // Clear mock data between tests
    jest.clearAllMocks()
  })

  describe("when the stage is either idea-generation or voting stage", () => {
    test.each([IDEA_GENERATION, VOTING])("sorts the ideas by id ascending in %s stage", stage => {
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

      render(
        <IdeaColumnListContainer
          {...defaultProps}
          ideas={ideas}
          category="confused"
          stage={stage}
        />
      )

      // Check the props passed to IdeaList
      const ideaBodies = IdeaList.mockProps.ideasSorted.map(idea => idea.body)
      expect(ideaBodies).toEqual([
        "should be first",
        "should be second",
        "should be third",
      ])

      // Verify the rendered content
      const listItems = screen.getAllByRole("listitem")
      expect(listItems[0]).toHaveTextContent("should be first")
      expect(listItems[1]).toHaveTextContent("should be second")
      expect(listItems[2]).toHaveTextContent("should be third")
    })
  })

  describe("when the stage is action-items or closed from the outset", () => {
    describe("when the category is anything *other* than action-items", () => {
      test.each([ACTION_ITEMS, CLOSED])("sorts the ideas by vote count descending in %s stage", stage => {
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

        render(
          <IdeaColumnListContainer
            {...defaultProps}
            ideas={ideas}
            votes={votes}
            stage={stage}
          />
        )

        // Check the props passed to IdeaList
        const ideaBodies = IdeaList.mockProps.ideasSorted.map(idea => idea.body)
        expect(ideaBodies).toEqual([
          "should be first based on votes",
          "should be second based on votes",
          "should be third based on votes",
        ])

        // Verify the rendered content
        const listItems = screen.getAllByRole("listitem")
        expect(listItems[0]).toHaveTextContent("should be first based on votes")
        expect(listItems[1]).toHaveTextContent("should be second based on votes")
        expect(listItems[2]).toHaveTextContent("should be third based on votes")
      })

      describe("when ideas have an identical vote count", () => {
        test("sorts the ideas with a secondary sort on id ascending", () => {
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

          render(
            <IdeaColumnListContainer
              {...defaultProps}
              ideas={ideas}
              votes={votes}
              stage={ACTION_ITEMS}
            />
          )

          // Check the props passed to IdeaList
          const ideaBodies = IdeaList.mockProps.ideasSorted.map(idea => idea.body)
          expect(ideaBodies).toEqual([
            "should be first based on voting tie and a higher id",
            "should be second based on voting tie and a lower id",
            "should be third based on lack of votes",
          ])

          // Verify the rendered content
          const listItems = screen.getAllByRole("listitem")
          expect(listItems[0]).toHaveTextContent("should be first based on voting tie and a higher id")
          expect(listItems[1]).toHaveTextContent("should be second based on voting tie and a lower id")
          expect(listItems[2]).toHaveTextContent("should be third based on lack of votes")
        })
      })
    })

    describe("when the category is 'action-items'", () => {
      test("sorts the ideas by id ascending", () => {
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

        render(
          <IdeaColumnListContainer
            {...defaultProps}
            ideas={ideas}
            category="action-item"
            stage={ACTION_ITEMS}
          />
        )

        // Check the props passed to IdeaList
        const ideaBodies = IdeaList.mockProps.ideasSorted.map(idea => idea.body)
        expect(ideaBodies).toEqual([
          "should be first based on id",
          "should be second based on id",
          "should be third based on id",
        ])

        // Verify the rendered content
        const listItems = screen.getAllByRole("listitem")
        expect(listItems[0]).toHaveTextContent("should be first based on id")
        expect(listItems[1]).toHaveTextContent("should be second based on id")
        expect(listItems[2]).toHaveTextContent("should be third based on id")
      })
    })
  })

  describe("when the stage is transitioned from voting to action-items", () => {
    describe("and the alert is cleared", () => {
      test("alters the sort order to most votes DESC", () => {
        const ideas = [{
          id: 5,
          body: "should be first after stage change alert removed",
          category: "confused",
        }, {
          id: 2,
          body: "should be first at outset",
          category: "confused",
        }]

        const votes = [
          { idea_id: 5 },
          { idea_id: 5 },
          { idea_id: 5 },
        ]

        // Use render with rerender capability for component that needs to be updated with new props
        const { rerender } = render(
          <IdeaColumnListContainer
            {...defaultProps}
            votes={votes}
            ideas={ideas}
            stage={VOTING}
            alert={null}
          />
        )

        // Initial render - should be sorted by id
        let listItems = screen.getAllByRole("listitem")
        expect(listItems[0]).toHaveTextContent("should be first at outset")
        expect(listItems[1]).toHaveTextContent("should be first after stage change alert removed")

        // Rerender with stage change and alert
        rerender(
          <IdeaColumnListContainer
            {...defaultProps}
            votes={votes}
            ideas={ideas}
            stage={ACTION_ITEMS}
            alert={{ headerText: "Stage Change: Action Items" }}
          />
        )

        // Should still be sorted by id because alert is present
        listItems = screen.getAllByRole("listitem")
        expect(listItems[0]).toHaveTextContent("should be first at outset")
        expect(listItems[1]).toHaveTextContent("should be first after stage change alert removed")

        // Rerender with alert cleared
        rerender(
          <IdeaColumnListContainer
            {...defaultProps}
            votes={votes}
            ideas={ideas}
            stage={ACTION_ITEMS}
            alert={null}
          />
        )

        // Now should be sorted by votes
        listItems = screen.getAllByRole("listitem")
        expect(listItems[0]).toHaveTextContent("should be first after stage change alert removed")
        expect(listItems[1]).toHaveTextContent("should be first at outset")
      })
    })
  })
})
