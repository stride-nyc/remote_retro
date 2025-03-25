import React from "react"
import { screen } from "@testing-library/react"
import "@testing-library/jest-dom"

import LobbyStage from "../../web/static/js/components/lobby_stage"
import renderWithRedux from "../support/js/render_with_redux"

describe("LobbyStage component", () => {
  const currentUser = {
    given_name: "Carol",
    is_facilitator: true,
    id: 1,
    picture: "http://derp.com",
    token: "herp",
  }
  const defaultProps = {
    stageConfig: {},
    currentUser,
    presences: [currentUser],
    facilitatorName: "Darren",
    actions: {},
  }

  describe("when the currentUser is the facilitator", () => {
    it("contains the instructions specific to the facilitator", () => {
      renderWithRedux(<LobbyStage {...defaultProps} />)
      expect(screen.getByText(/responsibility/i)).toBeInTheDocument()
    })
  })

  describe("when the currentUser is not the facilitator", () => {
    const nonFacilitatorProps = {
      ...defaultProps,
      currentUser: { ...currentUser, is_facilitator: false },
    }

    it("contains the instructions specific to participants", () => {
      renderWithRedux(<LobbyStage {...nonFacilitatorProps} />)
      expect(screen.getByText(/hold tight/i)).toBeInTheDocument()
    })
  })
})
