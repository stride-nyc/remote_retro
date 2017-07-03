import React from "react"
import { shallow } from "enzyme"
import { spy } from "sinon"

import Room from "../../web/static/js/components/room"
import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("Room component", () => {
  const mockRetroChannel = { push: spy(), on: () => {} }
  const stubUser = { given_name: "Mugatu" }
  const defaultProps = {
    currentUser: stubUser,
    retroChannel: mockRetroChannel,
    users: [],
    ideas: [],
    stage: "idea-generation",
  }

  context("when the current user is facilitator", () => {
    const facilitatorUser = { is_facilitator: true }

    context("and showActionItems is false", () => {
      it("renders the <StageProgressionButton>", () => {
        const roomComponent = shallow(
          <Room {...defaultProps} currentUser={facilitatorUser} />
        )

        expect(roomComponent.find(StageProgressionButton)).to.have.length(1)
      })
    })
  })

  context("when the current user is not facilitator", () => {
    const nonFacilitatorUser = { is_facilitator: false }

    it("does not render <StageProgressionButton>", () => {
      const roomComponent = shallow(
        <Room {...defaultProps} currentUser={nonFacilitatorUser} />
      )

      expect(roomComponent.find(StageProgressionButton)).to.have.length(0)
    })
  })
})
