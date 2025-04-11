/* eslint-disable react/prop-types */
import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import _ from "lodash"

import { GroupingBoard } from "../../web/static/js/components/grouping_board"

const mockDragStart = jest.fn()
const mockDragMove = jest.fn()
const mockDragEnd = jest.fn()

jest.mock("@dnd-kit/core", () => {
  return {
    DndContext: ({ children, onDragStart, onDragMove, onDragEnd }) => {
      mockDragStart.mockImplementation(onDragStart)
      mockDragMove.mockImplementation(onDragMove)
      mockDragEnd.mockImplementation(onDragEnd)

      return (
        <div
          data-testid="dnd-context"
          data-ondragstart={onDragStart ? "function" : undefined}
          data-ondragmove={onDragMove ? "function" : undefined}
          data-ondragend={onDragEnd ? "function" : undefined}
        >
          {children}
        </div>
      )
    },
    restrictToParentElement: jest.fn(),
  }
})

jest.mock("../../web/static/js/components/grouping_card", () => {
  const React = jest.requireActual("react")

  const MockGroupingIdeaCard = React.forwardRef(({ idea, children }, ref) => (
    <div ref={ref} data-testid="grouping-card" data-idea-id={idea.id}>
      {children}
    </div>
  ))

  return MockGroupingIdeaCard
})


jest.mock("../../web/static/js/services/idea_card_grouping", () => {
  return {
    __esModule: true,
    default: {
      findConnectedGroups: jest.fn().mockImplementation(() => {
        return []
      }),
    },
  }
})

const mockFindConnectedGroups = jest.requireMock("../../web/static/js/services/idea_card_grouping").default.findConnectedGroups

describe("GroupingBoard", () => {
  const defaultProps = {
    ideas: [],
    actions: {
      updateIdea: jest.fn(),
      broadcastIdeaDragStateChange: jest.fn(),
      ideaDraggedInGroupingStage: jest.fn(),
      submitIdeaEditAsync: jest.fn(),
    },
    userOptions: {},
    connectDropTarget: node => node,
    currentUser: { id: 1 },
  }

  describe("when there are no ideas to render", () => {
    it("renders no idea cards", () => {
      render(<GroupingBoard {...defaultProps} ideas={[]} />)
      const ideaCards = screen.queryAllByTestId("grouping-card")
      expect(ideaCards).toHaveLength(0)
    })
  })

  describe("when there are ideas to render", () => {
    describe("when the ideas are of equal length", () => {
      it("renders an idea for each card, sorted by id asc", () => {
        render(
          <GroupingBoard {...defaultProps} ideas={[{ body: "hey", id: 6 }, { body: "you", id: 5 }]} />
        )

        const ideaCards = screen.getAllByTestId("grouping-card")
        expect(ideaCards).toHaveLength(2)
        expect(ideaCards[0]).toHaveAttribute("data-idea-id", "5")
        expect(ideaCards[1]).toHaveAttribute("data-idea-id", "6")
      })
    })

    describe("when the idea bodies are of differing length", () => {
      it("renders the ideas by body length descending", () => {
        render(
          <GroupingBoard
            {...defaultProps}
            ideas={[
              { id: 6, body: "hi" },
              { id: 5, body: "howdy" },
              { id: 7, body: "hey" },
            ]}
          />
        )

        const ideaCards = screen.getAllByTestId("grouping-card")
        expect(ideaCards).toHaveLength(3)
        expect(ideaCards[0]).toHaveAttribute("data-idea-id", "5")
        expect(ideaCards[1]).toHaveAttribute("data-idea-id", "7")
        expect(ideaCards[2]).toHaveAttribute("data-idea-id", "6")
      })
    })

    describe("when there are more than 35 ideas", () => {
      const ideas = []

      beforeEach(() => {
        _.times(36, n => {
          ideas.push({ id: n, body: "foo" })
        })
      })

      it("ensures the cards are in their minimized variant to save grouping real estate", () => {
        const { container } = render(
          <GroupingBoard {...defaultProps} ideas={ideas} />
        )
        expect(container.querySelector(".grouping-board")).toBeTruthy()
      })
    })

    describe("when there are 35 ideas", () => {
      const ideas = []

      beforeEach(() => {
        _.times(35, n => { ideas.push({ id: n, body: "foo" }) })
      })

      it("does *not* minimize the cards within, as there is enough real estate to group comfortably", () => {
        const { container } = render(<GroupingBoard {...defaultProps} ideas={ideas} />)
        expect(container.querySelector(".grouping-board")).toBeTruthy()
      })
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("drag and drop functionality", () => {
    it("renders DndContext with all drag event handlers", () => {
      render(<GroupingBoard {...defaultProps} />)

      const dndContext = screen.getByTestId("dnd-context")
      expect(dndContext).toHaveAttribute("data-ondragstart", "function")
      expect(dndContext).toHaveAttribute("data-ondragmove", "function")
      expect(dndContext).toHaveAttribute("data-ondragend", "function")
    })

    describe("handleDragStart", () => {
      it("sets the dragStartPosition ref and updates dragging state", () => {
        const updateIdea = jest.fn()
        const broadcastIdeaDragStateChange = jest.fn()
        const ideas = [{ id: 1, body: "test idea", x: 100, y: 200 }]
        const currentUser = { id: 42 }

        render(
          <GroupingBoard
            {...defaultProps}
            ideas={ideas}
            currentUser={currentUser}
            actions={{
              ...defaultProps.actions,
              updateIdea,
              broadcastIdeaDragStateChange,
            }}
          />
        )

        mockDragStart({ active: { id: 1 } })

        expect(updateIdea).toHaveBeenCalledWith(1, { dragging_user_id: 42 })
        expect(broadcastIdeaDragStateChange).toHaveBeenCalledWith(1, 42)
      })
    })

    describe("handleDragMove", () => {
      it("calls ideaDraggedInGroupingStage with updated position", () => {
        const ideaDraggedInGroupingStage = jest.fn()
        const ideas = [{ id: 1, body: "test idea", x: 100, y: 200 }]

        render(
          <GroupingBoard
            {...defaultProps}
            ideas={ideas}
            actions={{
              ...defaultProps.actions,
              ideaDraggedInGroupingStage,
            }}
          />
        )

        mockDragStart({ active: { id: 1 } })

        mockDragMove({ active: { id: 1 }, delta: { x: 50, y: 30 } })

        expect(ideaDraggedInGroupingStage).toHaveBeenCalledWith({
          id: 1,
          x: 150, // 100 + 50
          y: 230, // 200 + 30
        })
      })
    })

    describe("handleDragEnd", () => {
      it("submits the idea edit and updates dragging state", () => {
        const submitIdeaEditAsync = jest.fn()
        const updateIdea = jest.fn()
        const broadcastIdeaDragStateChange = jest.fn()
        const ideas = [{ id: 1, body: "test idea", x: 100, y: 200 }]

        mockFindConnectedGroups.mockReturnValueOnce([{ groupId: 5, cardIds: [1, 2] }])

        render(
          <GroupingBoard
            {...defaultProps}
            ideas={ideas}
            actions={{
              ...defaultProps.actions,
              submitIdeaEditAsync,
              updateIdea,
              broadcastIdeaDragStateChange,
            }}
          />
        )

        mockDragStart({ active: { id: 1 } })

        mockDragEnd({ active: { id: 1 }, delta: { x: 50, y: 30 } })

        expect(submitIdeaEditAsync).toHaveBeenCalledWith({
          id: 1,
          x: 150, // 100 + 50
          y: 230, // 200 + 30
        })
        expect(mockFindConnectedGroups).toHaveBeenCalled()
        expect(updateIdea).toHaveBeenCalledWith(1, { dragging_user_id: null })
        expect(broadcastIdeaDragStateChange).toHaveBeenCalledWith(1, null)
      })
    })
  })

  describe("group synchronization", () => {
    it("updates idea temp_group_id when groups change", () => {
      const updateIdea = jest.fn()
      const ideas = [
        { id: 1, body: "idea 1", temp_group_id: null },
        { id: 2, body: "idea 2", temp_group_id: null },
      ]

      mockFindConnectedGroups.mockReturnValueOnce([{ groupId: 5, cardIds: [1, 2] }])

      render(
        <GroupingBoard
          {...defaultProps}
          ideas={ideas}
          actions={{
            ...defaultProps.actions,
            updateIdea,
          }}
        />
      )
      expect(updateIdea).toHaveBeenCalledWith(1, { temp_group_id: 5 })
      expect(updateIdea).toHaveBeenCalledWith(2, { temp_group_id: 5 })
    })
  })
})
