import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import { Idea } from "../../web/static/js/components/idea"
import STAGES from "../../web/static/js/configs/stages"

jest.mock("../../web/static/js/components/idea_edit_form", () => () => <div data-testid="idea-edit-form" />)
jest.mock("../../web/static/js/components/idea_live_edit_content", () => () => <div data-testid="idea-live-edit-content" />)
jest.mock("../../web/static/js/components/idea_content_base", () => () => <div data-testid="idea-content-base" />)

const { IDEA_GENERATION } = STAGES

describe("Idea component", () => {
  const idea = {
    id: 1,
    category: "sad",
    body: "redundant tests",
    user_id: 1,
  }

  const defaultProps = {
    currentUser: {},
    users: [],
    stage: IDEA_GENERATION,
    isAnActionItemsStage: true,
    canUserEditIdeaContents: true,
    ideaGenerationCategories: [],
    isTabletOrAbove: true,
    idea,
    actions: {}, // Add default actions to fix prop type warning
  }

  describe("when the idea is being edited locally", () => {
    const ideaInEditState = { ...idea, inEditState: true, isLocalEdit: true }

    it("renders an <IdeaEditForm/> as a child", () => {
      render(
        <Idea
          {...defaultProps}
          idea={ideaInEditState}
        />
      )
      expect(screen.getByTestId("idea-edit-form")).toBeInTheDocument()
    })

    describe("when the idea is being edited on a *different* client", () => {
      const ideaInEditState = { ...idea, inEditState: true, isLocalEdit: false }
      it("does not render an <IdeaEditForm/> as a child", () => {
        render(
          <Idea
            {...defaultProps}
            idea={ideaInEditState}
          />
        )
        expect(screen.queryByTestId("idea-edit-form")).not.toBeInTheDocument()
      })

      describe("when the idea has a `liveEditText` value", () => {
        it("renders the <IdeaLiveEditContent /> as a child", () => {
          render(
            <Idea
              {...defaultProps}
              idea={{ ...ideaInEditState, liveEditText: "editing bigtime" }}
            />
          )
          expect(screen.getByTestId("idea-live-edit-content")).toBeInTheDocument()
        })
      })
    })
  })

  describe("when the idea is not in an edit state", () => {
    const ideaInDefaultState = { ...idea, inEditState: false }

    it("renders <IdeaContentBase /> as a child", () => {
      render(
        <Idea
          {...defaultProps}
          idea={ideaInDefaultState}
        />
      )
      expect(screen.getByTestId("idea-content-base")).toBeInTheDocument()
    })

    it("does not render <IdeaEditForm/> as a child", () => {
      render(
        <Idea
          {...defaultProps}
          idea={ideaInDefaultState}
        />
      )
      expect(screen.queryByTestId("idea-edit-form")).not.toBeInTheDocument()
    })

    it("does not render <IdeaLiveEditContent/> as a child", () => {
      render(
        <Idea
          {...defaultProps}
          idea={ideaInDefaultState}
        />
      )
      expect(screen.queryByTestId("idea-live-edit-content")).not.toBeInTheDocument()
    })
  })
})
