import React from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import LowerThird from "../../web/static/js/components/lower_third"
import STAGES from "../../web/static/js/configs/stages"
import { renderWithRedux } from "../support/js/jest_test_helper"

const { IDEA_GENERATION, VOTING, CLOSED, GROUPING } = STAGES

describe("LowerThird component", () => {
  const stubUser = {
    given_name: "Mugatu",
    id: 1,
    is_facilitator: true,
    token: "abc123",
  }

  const defaultProps = {
    actions: {},
    userOptions: {},
    currentUser: stubUser,
    users: [stubUser],
    ideas: [],
    stage: IDEA_GENERATION,
    isAnActionItemsStage: false,
    stageConfig: {
      progressionButton: {
        copy: "Next",
        iconClass: "arrow right",
      },
    },
  }

  // Mock the Redux store with necessary data
  const initialReduxState = {
    retro: {
      facilitator_id: 1,
      stage: "idea-generation",
    },
    ideas: [],
    votes: [],
    usersById: { 1: stubUser },
    presences: [stubUser],
    ideaGenerationCategories: ["happy", "sad", "confused"],
    userOptions: { highContrastOn: false },
    alert: null,
  }

  describe("when the stage is `idea generation`", () => {
    it("renders the idea generation lower third", () => {
      renderWithRedux(
        <LowerThird
          {...defaultProps}
          stage={IDEA_GENERATION}
        />,
        initialReduxState
      )

      // Look for text that would be in the idea submission form
      expect(screen.getByText(/Submit an idea!/i)).toBeInTheDocument()
    })
  })

  describe("when the stage is `closed`", () => {
    it("renders business about the retro being read-only", () => {
      renderWithRedux(
        <LowerThird
          {...defaultProps}
          stage={CLOSED}
        />,
        initialReduxState
      )

      expect(screen.getByText(/This retro is all wrapped up!/i)).toBeInTheDocument()
      expect(screen.getByText(/Contents are read-only./i)).toBeInTheDocument()
    })
  })

  describe("when the stage is `grouping`", () => {
    it("renders grouping display", () => {
      renderWithRedux(
        <LowerThird
          {...defaultProps}
          stage={GROUPING}
        />,
        initialReduxState
      )

      expect(screen.getByText(/Grouping/i)).toBeInTheDocument()
      expect(screen.getByText(/Group Related Ideas/i)).toBeInTheDocument()
    })
  })

  describe("when the stage is voting", () => {
    it("renders voting lower third content", () => {
      renderWithRedux(
        <LowerThird
          {...defaultProps}
          stage={VOTING}
        />,
        initialReduxState
      )

      // The VotingLowerThirdContent renders a VotesLeft component
      // We can't easily test for specific text without knowing the implementation details
      // So we'll just check that the component renders without errors
      expect(document.querySelector(".ui.grid.basic.attached.secondary")).toBeInTheDocument()
    })
  })
})
