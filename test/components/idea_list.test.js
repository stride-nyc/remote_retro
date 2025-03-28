/* eslint-disable react/prop-types */
import React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import IdeaList from "../../web/static/js/components/idea_list"
import STAGES from "../../web/static/js/configs/stages"

const { IDEA_GENERATION } = STAGES

// Mock the Idea component since we're only testing that IdeaList renders the correct number of
// Idea components
jest.mock("../../web/static/js/components/idea", () => {
  return function MockIdea({ idea }) {
    return <div data-testid="idea-component" data-idea-id={idea.id}>{idea.body}</div>
  }
})

describe("IdeaList", () => {
  const defaultProps = {
    currentUser: { given_name: "daniel", is_facilitator: true },
    isTabletOrAbove: false,
    ideaGenerationCategories: [],
    votes: [],
    ideasSorted: [],
    stage: IDEA_GENERATION,
    alert: null,
  }

  it("renders an idea component for each idea given", () => {
    const ideasSorted = [{
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

    render(
      <IdeaList
        {...defaultProps}
        ideasSorted={ideasSorted}
      />
    )

    const ideaComponents = screen.getAllByTestId("idea-component")
    expect(ideaComponents).toHaveLength(2)
    expect(ideaComponents[0]).toHaveTextContent("should be first after stage change alert removed")
    expect(ideaComponents[1]).toHaveTextContent("should be first at outset")
  })
})
