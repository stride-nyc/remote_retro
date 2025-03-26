/* eslint-disable react/prop-types */
import React from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import { GroupsContainer } from "../../web/static/js/components/groups_container"
import { renderWithRedux } from "../support/js/test_helper"

// Mock components to avoid ref issues
jest.mock("react-flip-move", () => {
  return function MockFlipMove({ children }) {
    return <div>{children}</div>
  }
})

jest.mock("../../web/static/js/components/idea_group", () => {
  // Mock IdeaGroup as a div element directly to avoid FlipMove ref issues
  return {
    __esModule: true,
    default: function MockIdeaGroup(props) {
      const { groupWithAssociatedIdeasAndVotes } = props
      return <div data-testid={`idea-group-${groupWithAssociatedIdeasAndVotes.id}`}>IdeaGroup</div>
    },
  }
})

jest.mock("../../web/static/js/components/category_column", () => {
  return function MockCategoryColumn({ category }) {
    return <div data-testid={`category-column-${category}`}>CategoryColumn</div>
  }
})

jest.mock("../../web/static/js/components/contact_stride_cta", () => {
  return function MockContactStrideCTA() {
    return <div data-testid="contact-stride-cta">ContactStrideCTA</div>
  }
})

jest.mock("../../web/static/js/components/lower_third", () => {
  return function MockLowerThird() {
    return <div data-testid="lower-third">LowerThird</div>
  }
})

describe("GroupsContainer component", () => {
  const defaultProps = {
    groupsWithAssociatedIdeasAndVotes: [{
      id: 5,
      votes: [],
    }, {
      id: 6,
      votes: [],
    }],
    actions: {},
    currentUser: {},
    currentUserHasExhaustedVotes: false,
    stage: "idea-generation",
    stageConfig: {},
    ideas: [],
  }

  it("renders a IdeaGroup component for every group given", () => {
    renderWithRedux(<GroupsContainer {...defaultProps} />)
    expect(screen.getByTestId("idea-group-5")).toBeInTheDocument()
    expect(screen.getByTestId("idea-group-6")).toBeInTheDocument()
  })

  describe("when in the groups-labeling stage", () => {
    it("does *not* render a category column", () => {
      renderWithRedux(<GroupsContainer {...defaultProps} stage="groups-labeling" />)
      expect(screen.queryByTestId("category-column-action-item")).not.toBeInTheDocument()
    })

    describe("when the groups are given in an unsorted order", () => {
      it("renders them by id ascending", () => {
        const props = {
          ...defaultProps,
          stage: "groups-labeling",
          groupsWithAssociatedIdeasAndVotes: [{
            id: 102,
            votes: [],
          }, {
            id: 100,
            votes: [],
          }, {
            id: 101,
            votes: [],
          }],
        }

        renderWithRedux(<GroupsContainer {...props} />)
        const ideaGroups = screen.getAllByTestId(/idea-group-\d+/)
        const ideaGroupIds = ideaGroups.map(ideaGroup => parseInt(ideaGroup.getAttribute("data-testid").replace("idea-group-", ""), 10))

        // Check that the groups are rendered in ascending order by id
        expect(ideaGroupIds).toEqual([100, 101, 102])
      })
    })
  })

  describe("when in the groups-voting stage", () => {
    it("does *not* render a category column", () => {
      renderWithRedux(<GroupsContainer {...defaultProps} stage="groups-voting" />)
      expect(screen.queryByTestId("category-column-action-item")).not.toBeInTheDocument()
    })

    describe("when the groups are given in an unsorted order", () => {
      it("renders them by id ascending", () => {
        const props = {
          ...defaultProps,
          stage: "groups-voting",
          groupsWithAssociatedIdeasAndVotes: [{
            id: 102,
            votes: [],
          }, {
            id: 100,
            votes: [],
          }, {
            id: 101,
            votes: [],
          }],
        }

        renderWithRedux(<GroupsContainer {...props} />)
        const ideaGroups = screen.getAllByTestId(/idea-group-\d+/)
        const ideaGroupIds = ideaGroups.map(ideaGroup => parseInt(ideaGroup.getAttribute("data-testid").replace("idea-group-", ""), 10))

        expect(ideaGroupIds).toEqual([100, 101, 102])
      })
    })
  })

  describe("when in a stage *other than* groups-labeling/groups-voting", () => {
    it("renders a category column for action items", () => {
      renderWithRedux(<GroupsContainer {...defaultProps} stage="closed" />)
      expect(screen.getByTestId("category-column-action-item")).toBeInTheDocument()
    })

    describe("when the groups are given in an unsorted order", () => {
      describe("when one group has more votes than another", () => {
        it("renders them by vote count descending", () => {
          const props = {
            ...defaultProps,
            stage: "action-items",
            groupsWithAssociatedIdeasAndVotes: [{
              id: 4,
              votes: [{ id: 102 }],
            }, {
              id: 2,
              votes: [],
            }, {
              id: 3,
              votes: [{ id: 100 }, { id: 101 }],
            }],
          }

          renderWithRedux(<GroupsContainer {...props} />)
          const ideaGroups = screen.getAllByTestId(/idea-group-\d+/)
          const ideaGroupIds = ideaGroups.map(ideaGroup => parseInt(ideaGroup.getAttribute("data-testid").replace("idea-group-", ""), 10))

          expect(ideaGroupIds).toEqual([3, 4, 2])
        })
      })

      describe("when two groups have the same number of votes", () => {
        it("renders them by id ascending to ensure consistency across clients", () => {
          const props = {
            ...defaultProps,
            stage: "action-items",
            groupsWithAssociatedIdeasAndVotes: [{
              id: 2,
              votes: [],
            }, {
              id: 1,
              votes: [],
            }],
          }

          renderWithRedux(<GroupsContainer {...props} />)
          const ideaGroups = screen.getAllByTestId(/idea-group-\d+/)
          const ideaGroupIds = ideaGroups.map(ideaGroup => parseInt(ideaGroup.getAttribute("data-testid").replace("idea-group-", ""), 10))

          expect(ideaGroupIds).toEqual([1, 2])
        })
      })
    })
  })

  describe("when in the groups-closed stage", () => {
    describe("when the current user's locale indicates they're in the US timezone", () => {
      it("renders an ContactStrideCTA", () => {
        renderWithRedux(
          <GroupsContainer {...defaultProps} stage="groups-closed" currentUser={{ locale: "en" }} />
        )
        expect(screen.getByTestId("contact-stride-cta")).toBeInTheDocument()
      })
    })

    describe("when the current user's locale indicates they're outside a US timezone", () => {
      it("does not render a ContactStrideCTA", () => {
        renderWithRedux(
          <GroupsContainer {...defaultProps} stage="groups-closed" currentUser={{ locale: "en-GB" }} />
        )
        expect(screen.queryByTestId("contact-stride-cta")).not.toBeInTheDocument()
      })
    })
  })

  describe("when in a stage *other than* 'groups-closed'", () => {
    it("does *not* render an ContactStrideCTA column", () => {
      renderWithRedux(
        <GroupsContainer {...defaultProps} stage="groups-action-items" />
      )
      expect(screen.queryByTestId("contact-stride-cta")).not.toBeInTheDocument()
    })
  })
})
