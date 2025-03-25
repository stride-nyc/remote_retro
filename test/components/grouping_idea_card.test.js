import React from "react"
import { render } from "@testing-library/react"
import "@testing-library/jest-dom"
import { renderWithRedux } from "../support/js/jest_test_helper"

import { GroupingIdeaCard } from "../../web/static/js/components/grouping_idea_card"
import { COLLISION_BUFFER } from "../../web/static/js/services/collisions"

describe("<GroupingIdeaCard />", () => {
  let idea
  const mockUpdateIdea = jest.fn()
  const defaultProps = {
    idea: {},
    actions: {
      updateIdea: mockUpdateIdea,
    },
    userOptions: {},
    className: "",
    connectDragSource: node => node,
    connectDragPreview: node => node,
  }

  describe("when the given idea has coordinates", () => {
    beforeAll(() => {
      idea = { id: 5, body: "hello", x: 0, y: 109 }
      const { container } = renderWithRedux(
        <GroupingIdeaCard {...defaultProps} idea={idea} />
      )
      // Get the style attribute from the rendered component
      const ideaCard = container.querySelector(".idea-card")
      window.styleProp = ideaCard.style
    })

    it("applies fixed position inline styling", () => {
      expect(window.styleProp.position).toBe("fixed")
    })

    it("zeroes out the top attribute", () => {
      expect(window.styleProp.top).toBe("0px")
    })

    it("zeroes out the left attribute", () => {
      expect(window.styleProp.left).toBe("0px")
    })

    it("maps the x/y values to transform: translate3d", () => {
      expect(window.styleProp.transform).toBe("translate3d(0px,109px,0)")
    })

    it("maps the x/y values to WebkitTransform: translate", () => {
      expect(window.styleProp.WebkitTransform).toBe("translate3d(0px,109px,0)")
    })

    it("applies no margin", () => {
      const marginDeclarations = Object.keys(window.styleProp).filter(style => (style.match(/margin/i)))
      expect(marginDeclarations.length).toBe(0)
    })
  })

  describe("when the given idea *lacks* x and y attributes", () => {
    beforeEach(() => {
      idea = { id: 9, body: "goodbye", x: null, y: null }
      const { container } = renderWithRedux(
        <GroupingIdeaCard {...defaultProps} idea={idea} />
      )
      const ideaCard = container.querySelector(".idea-card")
      window.styleProp = ideaCard.style
    })

    it("adds margins to the top and right, but not the left or the bottom", () => {
      const marginDeclaration = window.styleProp.margin

      expect(marginDeclaration).toMatch(/\d+px \d+px 0px 0px/i)
    })

    it("applies a top and right margin greater than the collision buffer to avoid collisions registering on load", () => {
      const marginDeclaration = window.styleProp.margin

      const topAndRightMargins = marginDeclaration.match(/\d+/g).map(Number).slice(0, 2)

      expect(topAndRightMargins.every(margin => margin > COLLISION_BUFFER)).toBe(true)
    })
  })

  describe("when the given idea is in an edit state", () => {
    beforeEach(() => {
      idea = { id: 9, inEditState: true }
      const { container } = renderWithRedux(
        <GroupingIdeaCard {...defaultProps} idea={idea} />
      )
      window.container = container
    })

    it("applies a class for styling the edit state", () => {
      expect(window.container.querySelector(".in-edit-state")).toBeInTheDocument()
    })
  })

  describe("when the given idea is *not* in an edit state", () => {
    beforeEach(() => {
      idea = { id: 9, inEditState: false }
      const { container } = renderWithRedux(
        <GroupingIdeaCard {...defaultProps} idea={idea} />
      )
      window.container = container
    })

    it("does *not* apply a class for styling the edit state", () => {
      expect(window.container.querySelector(".in-edit-state")).not.toBeInTheDocument()
    })
  })

  describe("when an idea database update is in flight", () => {
    beforeEach(() => {
      idea = { id: 9, editSubmitted: true }
      const { container } = renderWithRedux(
        <GroupingIdeaCard {...defaultProps} idea={idea} />
      )
      window.container = container
    })

    it("displays a loader", () => {
      expect(window.container.querySelector(".loader")).toBeInTheDocument()
    })
  })

  describe("when an idea database update is *not* in flight", () => {
    beforeEach(() => {
      idea = { id: 9, editSubmitted: false }
      const { container } = renderWithRedux(
        <GroupingIdeaCard {...defaultProps} idea={idea} />
      )
      window.container = container
    })

    it("does not display a loader", () => {
      expect(window.container.querySelector(".loader")).not.toBeInTheDocument()
    })
  })

  describe("when the given idea has a grouping id", () => {
    beforeEach(() => {
      idea = { id: 9, ephemeralGroupingId: 15 }
      const { container, rerender } = renderWithRedux(
        <GroupingIdeaCard {...defaultProps} idea={idea} />
      )
      const ideaCard = container.querySelector(".idea-card")
      window.styleProp = ideaCard.style
      window.rerender = rerender
      window.container = container
    })

    it("adds a box shadow", () => {
      expect(window.styleProp.boxShadow).toBeTruthy()
    })

    describe("the box shadow color", () => {
      it("gets set to black(#000000) when highContrastOn is true", () => {
        window.rerender(
          <GroupingIdeaCard
            {...defaultProps}
            idea={idea}
            userOptions={{ highContrastOn: true }}
          />
        )
        const ideaCard = window.container.querySelector(".idea-card")
        const { boxShadow } = ideaCard.style

        expect(boxShadow).toContain("#000000")
      })

      it("does not get set to black(#000000) when highContrastOn is false", () => {
        window.rerender(
          <GroupingIdeaCard
            {...defaultProps}
            idea={idea}
            userOptions={{ highContrastOn: false }}
          />
        )
        const ideaCard = window.container.querySelector(".idea-card")
        const { boxShadow } = ideaCard.style

        expect(boxShadow).not.toContain("#000000")
      })

      it("changes when given a different ephmeral grouping id", () => {
        const boxShadowBefore = window.styleProp.boxShadow

        window.rerender(
          <GroupingIdeaCard
            {...defaultProps}
            idea={{ id: 9, ephemeralGroupingId: 11 }}
          />
        )
        const ideaCard = window.container.querySelector(".idea-card")
        const boxShadowAfter = ideaCard.style.boxShadow

        expect(boxShadowBefore).not.toBe(boxShadowAfter)
      })

      it("does not change when given the same ephmeral grouping id", () => {
        const boxShadowBefore = window.styleProp.boxShadow

        window.rerender(
          <GroupingIdeaCard
            {...defaultProps}
            idea={{ id: 9, ephemeralGroupingId: 15 }}
          />
        )
        const ideaCard = window.container.querySelector(".idea-card")
        const boxShadowAfter = ideaCard.style.boxShadow

        expect(boxShadowBefore).toBe(boxShadowAfter)
      })
    })
  })

  describe("when the given idea lacks a grouping id", () => {
    beforeEach(() => {
      idea = { id: 9 }
      const { container } = renderWithRedux(
        <GroupingIdeaCard {...defaultProps} idea={idea} />
      )
      const ideaCard = container.querySelector(".idea-card")
      window.styleProp = ideaCard.style
    })

    it("no box shadow is applied", () => {
      expect(window.styleProp.boxShadow).toBeFalsy()
    })
  })

  describe("on mount", () => {
    let actions

    beforeEach(() => {
      idea = { id: 54 }
      actions = {
        updateIdea: jest.fn(),
      }
      // Mock getBoundingClientRect to return consistent values
      Element.prototype.getBoundingClientRect = jest.fn(() => ({
        height: 0,
        width: 0,
        x: undefined,
        y: undefined,
      }))
      renderWithRedux(
        <GroupingIdeaCard
          {...defaultProps}
          idea={idea}
          actions={actions}
        />
      )
    })

    it("dispatches an action to the store, updating the idea with height/width/x/y", () => {
      expect(actions.updateIdea).toHaveBeenCalledWith(idea.id, {
        height: 0,
        width: 0,
        x: undefined,
        y: undefined,
      })
    })
  })

  describe("when updated", () => {
    let actions

    describe("and the given idea explicitly *lacks* a height and width", () => {
      beforeEach(() => {
        idea = { id: 54, height: undefined, width: undefined }

        actions = {
          updateIdea: jest.fn(),
        }

        // Mock getBoundingClientRect to return consistent values
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
          height: 0,
          width: 0,
          x: undefined,
          y: undefined,
        }))
        const { rerender } = renderWithRedux(
          <GroupingIdeaCard
            {...defaultProps}
            idea={idea}
            actions={actions}
          />
        )

        // Reset mock to ensure we're only testing the update
        actions.updateIdea.mockClear()

        // Update with new props
        rerender(
          <GroupingIdeaCard
            {...defaultProps}
            idea={idea}
            actions={actions}
          />
        )
      })

      it("dispatches an action to the store, updating the idea with height & width", () => {
        expect(actions.updateIdea).toHaveBeenCalledWith(idea.id, {
          height: 0,
          width: 0,
          x: undefined,
          y: undefined,
        })
      })
    })

    describe("and the new idea explicitly has numeric height + width", () => {
      beforeEach(() => {
        idea = { id: 54, height: 2, width: 2 }

        actions = {
          updateIdea: jest.fn(),
        }

        // Mock getBoundingClientRect to return consistent values
        Element.prototype.getBoundingClientRect = jest.fn(() => ({
          height: 2,
          width: 2,
          x: undefined,
          y: undefined,
        }))
        const { rerender } = render(
          <GroupingIdeaCard
            {...defaultProps}
            idea={idea}
            actions={actions}
          />
        )

        // Reset mock to ensure we're only testing the update
        actions.updateIdea.mockClear()

        // Update with new props
        rerender(
          <GroupingIdeaCard
            {...defaultProps}
            idea={idea}
            actions={actions}
          />
        )
      })

      it("does not dispatch an update idea action to the store", () => {
        expect(actions.updateIdea).not.toHaveBeenCalled()
      })
    })
  })
})
